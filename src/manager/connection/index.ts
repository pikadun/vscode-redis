import { TreeDataProvider, EventEmitter, ExtensionContext, TreeItemCollapsibleState, window, TreeItem } from 'vscode';
import { Socket, connect } from 'net';

import { RedisPanel } from '../../abstraction/enum';
import { PanelOptions, ConnectionOptions, RedisConfig } from '../../abstraction/interface';

import RESP from '../../redis/resp';
import utils from '../../node/utils';
import Dictionary from '../../common/dictionary';
import RedisItem from '../../node/redis';
import DBItem from '../../node/db';
import { RedisInfo } from '../../abstraction/redisinfo';
import Panel from '../panel';
import command from '../../redis/command';
import Config from './config';

class ConnectionProvider implements TreeDataProvider<TreeItem> {
    _onDidChangeTreeData = new EventEmitter<TreeItem | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    private sockets = new Dictionary<Socket>();
    private infos = new Dictionary<RedisInfo>();
    private config = new Config(this.context);

    constructor(private context: ExtensionContext) { }
    getTreeItem(element: TreeItem): TreeItem {
        return element;
    }

    async getChildren(element?: TreeItem): Promise<TreeItem[]> {
        if (element && element instanceof RedisItem) {
            const id = (element as RedisItem).id;
            if (!this.sockets.has(id)) {
                [element.socket, element.info] = await this.init(id);
            }
            return element.getChildren();
        } else if (element && element instanceof DBItem) {
            return element.getChildren();
        } else {
            const config = this.config.all();
            return Object.keys(config).map(id => {
                const item = new RedisItem(
                    id, config[id].name,
                    TreeItemCollapsibleState.Collapsed,
                    (e?: TreeItem) => { this.refresh(e); }
                );
                item.info = this.infos.get(id);
                item.socket = this.sockets.get(id);
                return item;
            });
        }
    }

    /**
     * Add or edit a connection
     * @param id Connection Id.
     * @param config The connection config.
     */
    async add([id, config]: ConnectionOptions): Promise<void> {
        const { host, port, auth, name } = config;
        try {
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

    delete(element: TreeItem): void {
        this.config.delete((element as RedisItem).id);
        this.refresh();
    }

    refresh(element?: TreeItem): void {
        this._onDidChangeTreeData.fire(element);
    }

    /**
     * Init redis connection and auth.
     * @param id Connection id
     * @param config Redis connection config
     */
    async init(id: string, config?: RedisConfig): Promise<[Socket, RedisInfo]> {
        config = config || this.config.get(id);
        const socket = await this.open(id, config);
        if (config.auth) {
            await command.run<string>(socket, `AUTH ${config.auth}`);
        }
        const info = await this.info(id, socket);
        return [socket, info];
    }

    private async open(id: string, config: RedisConfig): Promise<Socket> {
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
        this.sockets.set(id, socket);
        return socket;
    }

    private async info(id: string, socket: Socket): Promise<RedisInfo> {
        const infostr = await command.run<string>(socket, 'INFO');
        const info = utils.parseInfo(infostr);
        this.infos.set(id, info);
        return info;
    }
}

export default ConnectionProvider;