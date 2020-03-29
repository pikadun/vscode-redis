import { connect, Socket } from 'net'
import { RedisCommand } from './constant';

interface Config {
    host: string;
    port: number
}


class Command {
    run(cmd: RedisCommand, config: Config) {
        const socket = this.open(config.host, config.port);
        const c = this.convert(cmd.split(' '));
        const result = socket.write(c);
        socket.end();
        // TODO: 处理返回结果
        console.log(result);
    }

    private open(host: string, port: number): Socket {
        const socket = connect(port, host);
        socket.setTimeout(10000);
        socket.setNoDelay(true);
        return socket;
    }

    private convert(args: string[]) {
        let result = `*${args.length + 1}\r\n`;

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            result += `$${Buffer.byteLength(arg)}\r\n${arg}\r\n`
        }

        return result;
    }

}

export default new Command()