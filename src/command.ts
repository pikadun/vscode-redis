import { connect, Socket } from 'net'
import { RedisCommand } from './constant';

import RESP from './resp';


interface Config {
    host: string;
    port: number
}


class Command {
    async run(cmd: RedisCommand, config: Config) {
        const socket = this.open(config.host, config.port);
        const str = RESP.encode(cmd);

        const result = new Promise((resolve, reject) => {
            socket.on('data', (buffer) => {
                try {
                    const result = RESP.decode({ buffer, offset: 0 })
                    resolve(result)
                } catch (error) {
                    reject(error)
                }
            })
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