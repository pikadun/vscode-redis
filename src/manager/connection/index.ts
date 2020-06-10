import { TreeDataProvider, EventEmitter, ExtensionContext, TreeItemCollapsibleState, window } from 'vscode';
import { Socket, connect } from 'net';

import { Constant, RedisCommand, RedisPanel } from '../../abstraction/enum';
import { RedisItemConfig, PanelOptions, ConnectionOptions, RedisConfig } from '../../abstraction/interface';


import AbstractNode from '../../node/abstraction';
import RESP from '../../redis/resp';
import utils from '../../node/utils';
import Dictionary from '../../common/dictionary';
import RedisItem from '../../node/redis';
import DBItem from '../../node/db';
import { RedisInfo } from '../../abstraction/redisinfo';
import Panel from '../panel';
import command from '../../redis/command';

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
                await this.init(id, this.config.get(id));
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

    /**
     * Add or edit a connection
     * @param id Connection Id.
     * @param host The hostname of the redis.
     * @param port The port number to connect to.
     * @param auth The auth of the redis. Leave empty to ignore.
     */
    async add([id, host, port, auth, ...ca]: ConnectionOptions): Promise<void> {
        console.log(ca);
        
        try {
            const name = `${host}:${port}`;
            id = id || Date.now().toString();
            await this.init(id, { host, port, auth });
            this.config.set(id, { host, port, auth, name });
            this.refresh();
        } catch (error) {
            window.showErrorMessage(error.message);
        }
    }

    /**
     * Add or edit a connection
     * @param panel Panel instance
     * @param id Connection id
     */
    edit(panel: Panel, id?: string): void {
        const options: PanelOptions = {};
        if (id) {
            options.connection = this.config.get(id);
        }
        panel.show(RedisPanel.CONNECTION, options);
    }

    delete(element: AbstractNode): void {
        this.config.delete((element as RedisItem).id);
        this.refresh();
    }

    refresh(element?: AbstractNode): void {
        this._onDidChangeTreeData.fire(element);
    }

    /**
     * Init redis connection and auth.
     * @param id Connection id
     * @param config Redis connection config
     */
    private async init(id: string, config: RedisConfig): Promise<void> {
        const socket = await this.open(config);
        if (config.auth) {
            await command.run<string>(socket, `AUTH ${config.auth}`);
        }
        this.sockets.set(id, socket);
        await this.info(id, socket);
    }

    private async open(config: RedisConfig): Promise<Socket> {
        const socket: Socket = await new Promise((resolve, reject) => {
            const socket = connect(config.port, config.host);
            socket.once('connect', () => { resolve(socket); });
            socket.once('error', err => { reject(err); });
        });

        socket.setKeepAlive(true);
        socket.setTimeout(10000);
        socket.setNoDelay(true);

        socket.on('data', buffer => {
            RESP.decode(buffer);
        });

        return socket;
    }

    private async info(id: string, socket: Socket): Promise<void> {
        const infostr = await command.run<string>(socket, RedisCommand.INFO);
        const info = utils.parseInfo(infostr);
        this.infos.set(id, info);
    }
}

export default Connection;