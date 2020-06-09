import Command from './command';
import RedisParser from 'redis-parser';
import { window } from 'vscode';

const parser = new RedisParser({
    returnReply(reply: string): void {
        Command.setReply(reply);
    },
    returnError(err: Error): void {
        window.showErrorMessage(err.message);
    },
    returnFatalError(err: Error): void {
        window.showErrorMessage(err.message);
    }
});

class RESP {
    encode(cmd: string): string {
        const args = cmd.split(' ');
        let result = `*${args.length}\r\n`;

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            result += `$${Buffer.byteLength(arg)}\r\n${arg}\r\n`;
        }
        return result;
    }

    decode(buffer: Buffer): void {
        parser.execute(buffer);
    }
}

export default new RESP();