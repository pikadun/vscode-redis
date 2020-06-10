import { Socket } from 'net';
import { RedisCommand } from '../abstraction/enum';
import RESP from './resp';

class Command {
    setReply!: Function;
    setError!: Function;
    setFatalError!: Function;

    async run<T>(socket: Socket, cmd: RedisCommand | string): Promise<T> {

        const str = RESP.encode(cmd);

        const result = new Promise<T>((resolve, reject) => {
            this.setReply = (reply: T): void => {
                resolve(reply);
            };
            this.setError = (error: Error): void => {
                reject(error);
            };
            this.setFatalError = (error: Error): void => {
                reject(error);
            };
        });

        socket.write(str);
        return result;
    }
}

export default new Command();