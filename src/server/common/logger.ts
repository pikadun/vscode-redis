import { window } from 'vscode';

class Logger {
    private logger = window.createOutputChannel('Redis');
    info(msg: string) {
        this.logger.appendLine(msg);
    }
}

export default new Logger();