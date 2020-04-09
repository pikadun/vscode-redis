import { TreeDataProvider, EventEmitter, ExtensionContext, TreeItemCollapsibleState, Event, window } from "vscode";
import { Socket, connect } from "net";

import { Constant, RedisCommand } from "../abstraction/constant";
import { RedisItemConfig } from "../abstraction/interface";


import AbstractNode from "../node/abstraction";
import RESP from '../redis/resp'
import Command from "../redis/command";
import utils from "../node/utils";
import Collection from "./collection";
import RedisItem from "../node/redis";
import DBItem from "../node/db";

class Connection implements TreeDataProvider<AbstractNode> {
    _onDidChangeTreeData: EventEmitter<AbstractNode> = new EventEmitter<AbstractNode>();
    readonly onDidChangeTreeData: Event<AbstractNode> = this._onDidChangeTreeData.event;

    private sockets = new Collection();
    private infos = new Collection();
    private config = new Config(this.context);

    constructor(private context: ExtensionContext) { }
    getTreeItem(element: AbstractNode) {
        return element;
    }

    async getChildren(element?: AbstractNode) {
        if (element && element instanceof RedisItem) {
            const id = (element as RedisItem).id;
            if (!this.sockets.has(id)) {
                await this.init(id, this.config.get(id).host, this.config.get(id).port);
                element.info = this.infos.get(id);
                element.socket = this.sockets.get(id);
            }
            return element.getChildren()
        } else if (element && element instanceof DBItem) {
            return element.getChildren()
        } else {
            const config = this.config.all();
            return Object.keys(config).map(id => {
                const item = new RedisItem(id, config[id].name, TreeItemCollapsibleState.Collapsed);
                item.info = this.infos.get(id);
                item.socket = this.sockets.get(id);
                return item;
            })
        }
    }

    async add() {
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

    delete(element: AbstractNode) {
        this.config.delete((element as RedisItem).id)
        this.refresh();
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    private async getHost() {
        const host = await window.showInputBox({ prompt: "The hostname of the redis.", placeHolder: "host (default 127.0.0.1)", ignoreFocusOut: true });
        return host;
    }

    private async getPort() {
        const port = await window.showInputBox({ prompt: "The port number to connect to.", placeHolder: "port (default 6379)", ignoreFocusOut: true });
        return port;
    }

    private async getName() {
        const name = await window.showInputBox({ prompt: "The name of the connection.", placeHolder: "name (default <host:port>)", ignoreFocusOut: true });
        return name;
    }

    private async getAuth() {
        const auth = await window.showInputBox({ prompt: "The auth of the redis. Leave empty to ignore", placeHolder: "auth", ignoreFocusOut: true });
        return auth;
    }

    private async init(id: string, host: string, port: number) {
        await this.open(id, host, port);
        await this.info(id, this.sockets.get(id));
    }

    private async open(id: string, host: string, port: number) {
        const socket: Socket = await new Promise((resolve, reject) => {
            const socket = connect(port, host);
            socket.once('connect', () => { resolve(socket); })
            socket.once('error', err => { reject(err); })
        })

        socket.setKeepAlive(true);
        socket.setTimeout(10000);
        socket.setNoDelay(true);

        socket.on('data', buffer => {
            RESP.decode(buffer);
        })

        this.sockets.set(id, socket);
    }

    private async info(id: string, socket: Socket) {
        const infostr = await Command.run(socket, RedisCommand.INFO);
        const info = utils.parseInfo(infostr);
        this.infos.set(id, info);
    }
}

class Config {
    constructor(private context: ExtensionContext) { }
    all() {
        return this.context.globalState.get<{ [key: string]: RedisItemConfig }>(Constant.GLOBAL_STATE_REDIS_CONFIG_KEY) || {};
    }

    get(id: string) {
        const configs = this.all();
        return configs[id];
    }

    set(id: string, config: RedisItemConfig) {
        const configs = this.all();
        configs[id] = config;
        this.context.globalState.update(Constant.GLOBAL_STATE_REDIS_CONFIG_KEY, configs);
    }

    delete(id: string) {
        const configs = this.all();
        delete configs[id];
        this.context.globalState.update(Constant.GLOBAL_STATE_REDIS_CONFIG_KEY, configs);
    }
}

export default Connection