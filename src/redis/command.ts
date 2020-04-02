import { connect, Socket } from 'net'
import { RedisCommand } from '../abstraction/constant';
import { RedisConfig } from '../abstraction/interface';
import RESP from './resp';

class Command {
    public setReply!: Function

    async run(cmd: RedisCommand, config: RedisConfig): Promise<any> {
        const socket = this.open(config.host, config.port);
        const str = RESP.encode(cmd);
        const result = new Promise((resolve) => {
            this.setReply = (reply: any) => {
                resolve(reply);
                socket.end()
            }
        })
        socket.on('data', (buffer) => {
            RESP.decode(buffer);
        })
        socket.write(str);
        return result;
    }

    private open(host: string, port: number): Socket {
        const socket = connect(port, host);
        socket.setKeepAlive(true);
        socket.setTimeout(10000);
        socket.setNoDelay(true);
        return socket;
    }
}

export default new Command();