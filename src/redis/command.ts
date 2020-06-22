import { Socket } from 'net';
import RESP from './resp';

class Command {
    setReply!: (reply: unknown) => void;
    setError!: (error: Error) => void;
    setFatalError!: (error: Error) => void;

    async run<T>(socket: Socket, cmd: string): Promise<T> {

        const str = RESP.encode(cmd);

        const result = new Promise<T>((resolve, reject) => {
            this.setReply = reply => {
                resolve(reply as T);
            };
            this.setError = error => {
                reject(error);
            };
            this.setFatalError = error => {
                reject(error);
            };
        });

        socket.write(str);
        return result;
    }
}

export default new Command();