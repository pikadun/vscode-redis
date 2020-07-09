import path from 'path';
import { TreeItemContextValue } from 'src/abstraction/enum';
import { RedisInfo } from 'src/abstraction/redisinfo';
import { TreeItemCollapsibleState } from 'vscode';
import command from 'src/common/command';
import DBItem from './db';
import { Socket, connect } from 'net';
import Element from 'src/manager/connection/element';
import { RedisConfig } from 'src/abstraction/interface';
import utils from 'src/common/utils';
import resp from 'src/common/resp';

class RedisItem extends Element {
    contextValue = TreeItemContextValue.REDIS;
    iconPath = path.join(__dirname, '..', 'img', `${this.contextValue}.png`);
    info?: RedisInfo;
    socket?: Socket;
    socketReady = false;
    constructor(
        readonly id: string,
        readonly config: RedisConfig
    ) {
        super(config.name, TreeItemCollapsibleState.Collapsed);
    }

    async getChildren(): Promise<DBItem[]> {
        const dbInfo = await this.run<string>('CONFIG GET databases');
        const count = parseInt(dbInfo[1]);
        const result: DBItem[] = [];
        for (let i = 0; i < count; i++) {
            const dbName = `db${i}(${this.info?.Keyspace[`db${i}`]?.keys || 0})`;
            result.push(new DBItem(this, i, dbName));
        }
        return result;
    }

    /**
     * Init redis connection and get redis info.
     */
    async init(): Promise<void> {
        this.socket = await this.createSocket();

        if (this.config.auth) {
            await this.run<string>(`AUTH ${this.config.auth}`);
        }

        this.info = await this.getInfo();
    }

    /**
     * Open a connection.
     */
    private async createSocket(): Promise<Socket> {
        const socket: Socket = await new Promise((resolve, reject) => {
            const socket = connect(this.config.port, this.config.host);
            socket.once('connect', () => {
                this.socketReady = true;
                resolve(socket);
            });
            socket.once('error', err => { reject(err); });
        });

        socket.setKeepAlive(true);
        socket.setTimeout(10000);
        socket.setNoDelay(true);

        socket.on('data', buffer => {
            resp.decode(buffer);
        });

        socket.on('close', () => {
            this.socketReady = false;
        });
        return socket;
    }

    /**
     * Get redis info.
     */
    private async getInfo(): Promise<RedisInfo> {
        const infostr = await this.run<string>('INFO');
        return utils.parseInfo(infostr);
    }

    /**
     * Run a command on the instance.
     * @param cmd Command string.
     */
    async run<T>(cmd: string): Promise<T> {
        if (!this.socketReady) {
            await this.init();
        }

        return command.run<T>(this.socket as Socket, cmd);
    }

    dispose(): void {
        this.socket?.end();
    }
}

export default RedisItem;