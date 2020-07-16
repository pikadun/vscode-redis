import Command from './command';
import RedisParser from 'redis-parser';
import {RESP} from '@pikadun/resp';

const resp = new RESP();

const parser = new RedisParser({
    returnReply(reply: unknown): void {
        Command.setReply(reply);
    },
    returnError(err: Error): void {
        Command.setError(err);
    },
    returnFatalError(err: Error): void {
        Command.setFatalError(err);
    }
});

class RESP_Old {
    encode(cmd: string): string {
        return resp.encode(cmd);
    }

    decode(buffer: Buffer): void {
        parser.execute(buffer);
    }
}

export default new RESP_Old();