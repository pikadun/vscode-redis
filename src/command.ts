import { connect, Socket } from 'net'
import { RedisCommand } from './constant';


interface Config {
    host: string;
    port: number
}


class Command {
    async run(cmd: RedisCommand, config: Config) {
        const str = this.convert(cmd.split(' '));
        const socket = this.open(config.host, config.port);

        const result = new Promise((resolve) => {
            socket.on('data', (buffer) => {
                resolve(this.dataHandle(buffer))
            })
        })

        socket.write(str);
        socket.end();
        return result;
    }

    private open(host: string, port: number): Socket {
        const socket = connect(port, host);
        socket.setKeepAlive(true);
        socket.setTimeout(10000);
        socket.setNoDelay(true);
        return socket;
    }

    private convert(args: string[]) {
        let result = `*${args.length}\r\n`;

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            result += `$${Buffer.byteLength(arg)}\r\n${arg}\r\n`
        }

        return result;
    }

    private dataHandle(buffer: Buffer) {
        const reply = buffer.toString();
        return reply
    }

}

export default new Command();