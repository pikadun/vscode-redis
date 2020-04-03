import { Socket } from 'net'
import { RedisCommand } from '../abstraction/constant';
import RESP from './resp';

class Command {
    public setReply!: Function;

    async run(socket: Socket, cmd: RedisCommand): Promise<any> {

        const str = RESP.encode(cmd);

        const result = new Promise((resolve) => {
            this.setReply = (reply: any) => {
                resolve(reply);
            }
        })

        socket.write(str);
        return result;
    }


}

export default new Command();