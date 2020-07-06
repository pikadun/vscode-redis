import { Pseudoterminal, EventEmitter } from 'vscode';
import { Socket } from 'net';
import command from 'src/redis/command';
import { Constant } from 'src/abstraction/enum';

class Pty implements Pseudoterminal {
    private writeEmitter = new EventEmitter<string>();
    readonly onDidWrite = this.writeEmitter.event;
    private input: string[] = [];
    private cursor = 0;

    constructor(
        private name: string,
        private socket: Socket,
        private welcome: boolean,
        private closeEvent: () => void
    ) {
        this.name = name + '> ';
    }

    /**
     * Show welcome message once a day.
     */
    open(): void {
        if (this.welcome) {
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
            const char = data[i];
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
                case 27:
                    const next1 = data[++i].charCodeAt(0);
                    const next2 = data[++i].charCodeAt(0);
                    if (next1 === 91) {
                        if (next2 === 68) { // left
                            this.cursor = Math.max(0, this.cursor - 1);
                        } else if (next2 === 67) { // right
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

    /**
     * Execute command when the user enters enter.
     */
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


        let result = '';
        try {
            result = await command.run<string>(this.socket, input);
        } catch (error) {
            result = error.message;
        }
        this.writeEmitter.fire('\r\n');
        this.writeEmitter.fire(result);
        this.writeEmitter.fire('\r\n');
    }
}

export default Pty;