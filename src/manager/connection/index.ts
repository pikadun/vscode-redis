import { TreeDataProvider, EventEmitter, ExtensionContext, TreeItemCollapsibleState, window } from 'vscode';
import { Socket, connect } from 'net';

import { Constant, RedisCommand, RedisPanel } from '../../abstraction/enum';
import { RedisItemConfig, PanelOptions } from '../../abstraction/interface';


import AbstractNode from '../../node/abstraction';
import RESP from '../../redis/resp';
import Command from '../../redis/command';
import utils from '../../node/utils';
import Dictionary from '../../common/dictionary';
import RedisItem from '../../node/redis';
import DBItem from '../../node/db';
import { RedisInfo } from '../../abstraction/redisinfo';
import Panel from '../panel';

class Config {
    constructor(private context: ExtensionContext) { }
    all(): { [key: string]: RedisItemConfig } {
        return this.context.globalState.get<{ [key: string]: RedisItemConfig }>(Constant.GLOBAL_STATE_REDIS_CONFIG_KEY) || {};
    }

    get(id: string): RedisItemConfig {
        const configs = this.all();
        return configs[id];
    }

    set(id: string, config: RedisItemConfig): void {
        const configs = this.all();
        configs[id] = config;
        this.context.globalState.update(Constant.GLOBAL_STATE_REDIS_CONFIG_KEY, configs);
    }

    delete(id: string): void {
        const configs = this.all();
        delete configs[id];
        this.context.globalState.update(Constant.GLOBAL_STATE_REDIS_CONFIG_KEY, configs);
    }
}

class Connection implements TreeDataProvider<AbstractNode> {
    _onDidChangeTreeData = new EventEmitter<AbstractNode | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    private sockets = new Dictionary<Socket>();
    private infos = new Dictionary<RedisInfo>();
    private config = new Config(this.context);

    constructor(private context: ExtensionContext) { }
    getTreeItem(element: AbstractNode): AbstractNode {
        return element;
    }

    async getChildren(element?: AbstractNode): Promise<AbstractNode[]> {
        if (element && element instanceof RedisItem) {
            const id = (element as RedisItem).id;
            if (!this.sockets.has(id)) {
                await this.init(id, this.config.get(id).host, this.config.get(id).port);
                element.info = this.infos.get(id);
                element.socket = this.sockets.get(id);
            }
            return element.getChildren();
        } else if (element && element instanceof DBItem) {
            return element.getChildren('*');
        } else {
            const config = this.config.all();
            return Object.keys(config).map(id => {
                const item = new RedisItem(id, config[id].name, TreeItemCollapsibleState.Collapsed);
                item.info = this.infos.get(id);
                item.socket = this.sockets.get(id);
                return item;
            });
        }
    }

    async add(): Promise<void> {
        let host = await this.getHost();
        if (host === undefined) {
            return;
        } else if (host === '') {
            host = '127.0.0.1';
        }

        let port = await this.getPort();
        if (port === undefined) {
            return;
        } else if (port === '') {
            port = '6379';
        }

        let name = await this.getName();
        if (name === undefined) {
            return;
        } else if (name === '') {
            name = `${host}:${port}`;
        }

        const auth = await this.getAuth();
        if (auth === undefined) return;

        const id = Date.now().toString();

        await this.init(id, host, parseInt(port));
        this.config.set(id, { host, port: parseInt(port), auth, name });
        this.refresh();
    }

    /**
     * Add or edit a connection
     * @param panel Panel instance
     * @param id connection id
     */
    edit(panel: Panel, id?: string): void {
        const options: PanelOptions = {};
        if (id) {
            options.connection = this.config.get(id);
        }
        panel.show(RedisPanel.CONNECTION, options);
    }

    test(p1: string, p2: string, p3: string): void {
        console.log(p1);
        console.log(p2);
        console.log(p3);
    }

    delete(element: AbstractNode): void {
        this.config.delete((element as RedisItem).id);
        this.refresh();
    }

    refresh(element?: AbstractNode): void {
        this._onDidChangeTreeData.fire(element);
    }

    private async getHost(): Promise<string | undefined> {
        const host = await window.showInputBox({ prompt: 'The hostname of the redis.', placeHolder: 'host (default 127.0.0.1)', ignoreFocusOut: true });
        return host;
    }

    private async getPort(): Promise<string | undefined> {
        const port = await window.showInputBox({ prompt: 'The port number to connect to.', placeHolder: 'port (default 6379)', ignoreFocusOut: true });
        return port;
    }

    private async getName(): Promise<string | undefined> {
        const name = await window.showInputBox({ prompt: 'The name of the connection.', placeHolder: 'name (default <host:port>)', ignoreFocusOut: true });
        return name;
    }

    private async getAuth(): Promise<string | undefined> {
        const auth = await window.showInputBox({ prompt: 'The auth of the redis. Leave empty to ignore', placeHolder: 'auth', ignoreFocusOut: true });
        return auth;
    }

    private async init(id: string, host: string, port: number): Promise<void> {
        await this.open(id, host, port);
        await this.info(id, this.sockets.get(id));
    }

    private async open(id: string, host: string, port: number): Promise<void> {
        const socket: Socket = await new Promise((resolve, reject) => {
            const socket = connect(port, host);
            socket.once('connect', () => { resolve(socket); });
            socket.once('error', err => { reject(err); });
        });

        socket.setKeepAlive(true);
        socket.setTimeout(10000);
        socket.setNoDelay(true);

        socket.on('data', buffer => {
            RESP.decode(buffer);
        });

        this.sockets.set(id, socket);
    }

    private async info(id: string, socket: Socket): Promise<void> {
        const infostr = await Command.run<string>(socket, RedisCommand.INFO);
        const info = utils.parseInfo(infostr);
        this.infos.set(id, info);
    }
}

export default Connection;