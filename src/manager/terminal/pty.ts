import { Pseudoterminal, EventEmitter } from 'vscode';
// import { stringify } from 'querystring';

class Pty implements Pseudoterminal {
    private writeEmitter = new EventEmitter<string>();
    readonly onDidWrite = this.writeEmitter.event;
    private input: string[] = [];
    private cursor = 0;

    constructor(
        private name: string,
        private closeEvent: Function
    ) {
        this.name = name + '> ';
    }

    /**
     * Show the name of termianl after opened.
     */
    open(): void {
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
    handleInput(data: string): void {
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
                    this.cursor = 0;
                    this.input = [];
                    this.writeEmitter.fire('\r\n');
                    break;
                case 27:
                    // eslint-disable-next-line no-case-declarations
                    const next1 = data[++i].charCodeAt(0);
                    // eslint-disable-next-line no-case-declarations
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
        this.writeEmitter.fire('\x1b[1000D');
        // Clears from cursor to end of line.
        this.writeEmitter.fire('\x1b[0K');
        this.writeEmitter.fire(this.name);
        this.writeEmitter.fire(this.input.join(''));
        // Move cursor to start again.
        this.writeEmitter.fire('\x1b[1000D');
        // Move cursor to cursor.
        this.writeEmitter.fire(`\x1b[${this.name.length + this.cursor}C`);
    }
}

export default Pty;