import Command from "./command";
import RedisParser from "redis-parser"

// const RedisParser = require('redis-parser');
const parser = new RedisParser({
    returnReply(reply: string): void {
        Command.setReply(reply)
    },
    returnError(err: string): void {
        console.log(JSON.stringify(err))
    },
    returnFatalError(err: string): void {
        console.log(JSON.stringify(err))
    }
});

class RESP {
    encode(cmd: string): string {
        const args = cmd.split(" ");
        let result = `*${args.length}\r\n`;

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            result += `$${Buffer.byteLength(arg)}\r\n${arg}\r\n`
        }
        return result;
    }

    decode(buffer: Buffer): void {
        parser.execute(buffer)
    }
}

export default new RESP()