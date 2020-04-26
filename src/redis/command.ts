import { Socket } from 'net';
import { RedisCommand } from '../abstraction/enum';
import RESP from './resp';

class Command {
    setReply!: Function;

    async run<T>(socket: Socket, cmd: RedisCommand | string): Promise<T> {

        const str = RESP.encode(cmd);

        const result = new Promise<T>((resolve) => {
            this.setReply = (reply: T): void => {
                resolve(reply);
            };
        });

        socket.write(str);
        return result;
    }
}

export default new Command();