/* eslint-disable no-case-declarations */
import { EventEmitter, Pseudoterminal } from 'vscode';
import Constant from '../common/constant';
import RedisItem from '../tree/redis';
import lexer from './lexer';

export default class Pty implements Pseudoterminal {
    private writeEmitter = new EventEmitter<string>();
    onDidWrite = this.writeEmitter.event;

    private dbIndex = 0;
    private cursor = 0;
    private input: string[] = [];
    private get name(): string {
        return `${this.redis.config.name}[${this.dbIndex}]> `;
    }

    constructor(
        private redis: RedisItem,
        private showWelcome: boolean,
        private closeEvent: () => void
    ) { }

    /**
     * Show welcome message once a day.
     */
    open(): void {
        if (this.showWelcome) {
            this.writeEmitter.fire('Welcome to redis extension!\r\n');
            this.writeEmitter.fire(` ⭐ Star:     ${Constant.GITHUB_REPO}.\r\n`);
            this.writeEmitter.fire(` 💬 Feedback: ${Constant.GITHUB_REPO}/issues.\r\n`);
            this.writeEmitter.fire('\r\n');
        }
        this.writeEmitter.fire(this.name);
    }
    /**
     * Terminal is closed by an act of the user.
     */
    close(): void {
        this.closeEvent();
    }

    /**
     * Handle user input data.
     * https://www.lihaoyi.com/post/BuildyourownCommandLinewithANSIescapecodes.html
     * @param data User input data.
     */
    async handleInput(data: string): Promise<void> {
        for (let i = 0; i < data.length; i++) {
            const char = data[i] as string;
            switch (char.charCodeAt(0)) {
                case 3: // ctrl+c
                    this.cursor = 0;
                    this.input = [];
                    this.writeEmitter.fire('^C\r\n');
                    break;
                case 10: // \n
                case 13: // \r
                    await this.finishInput();
                    this.cursor = 0;
                    this.input = [];
                    break;
                case 27: // (Left, Right, Up, Down) are (27 91 68, 27 91 67, 27 91 65, 27 91 66)
                    const next1 = data[++i]?.charCodeAt(0);
                    const next2 = data[++i]?.charCodeAt(0);
                    if (next1 === 91) {
                        if (next2 === 68) { // Left
                            this.cursor = Math.max(0, this.cursor - 1);
                        } else if (next2 === 67) { // Right
                            this.cursor = Math.min(this.input.length, this.cursor + 1);
                        }
                    }
                    break;
                case 127: // \b
                    this.input.splice(this.cursor - 1, 1);
                    this.cursor = Math.max(0, this.cursor - 1);
                    break;
                default:
                    this.input.splice(this.cursor, 0, char);
                    this.cursor++;
            }
        }

        // Move cursor to start.
        this.writeEmitter.fire('\x1b[G');
        // Clears from cursor to end of line.
        this.writeEmitter.fire('\x1b[0K');

        this.writeEmitter.fire(this.name);
        this.writeEmitter.fire(this.input.join(''));

        // Move cursor to start again.
        this.writeEmitter.fire('\x1b[G');
        // Move cursor to cursor.
        this.writeEmitter.fire(`\x1b[${this.name.length + this.cursor}C`);
    }

    async finishInput(): Promise<void> {
        const input = this.input.join('');
        switch (input) {
            case '':
                return;
            case 'clear':
                this.writeEmitter.fire('\x1b[2J');
                this.writeEmitter.fire('\x1b[0;0f');
                return;
        }

        const inputToken = lexer.analyze(this.input);
        const command = inputToken[0].toLowerCase();
        const args = inputToken[1];
        const result = await this.redis.run(command, inputToken[1]);

        if (command === 'select') {
            this.dbIndex = args[0] as unknown as number;
        }

        this.writeEmitter.fire('\r\n');
        this.writeEmitter.fire(result as string);
        this.writeEmitter.fire('\r\n');
    }
}