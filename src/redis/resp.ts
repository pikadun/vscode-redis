import Command from "./command";

const RedisParser = require('redis-parser');
const parser = new RedisParser({
    returnReply(reply: any) {
        Command.setReply(reply)
    },
    returnError(err: any) {
        console.log(JSON.stringify(err))
    },
    returnFatalError(err: any) {
        console.log(JSON.stringify(err))
    }
});

class RESP {
    encode(cmd: string) {
        const args = cmd.split(' ');
        let result = `*${args.length}\r\n`;

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            result += `$${Buffer.byteLength(arg)}\r\n${arg}\r\n`
        }
        return result;
    }

    decode(buffer: Buffer) {
        parser.execute(buffer)
    }
}

export default new RESP()