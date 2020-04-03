import { TreeDataProvider, EventEmitter, ExtensionContext, TreeItemCollapsibleState, Event, window } from "vscode";
import { Socket, connect } from "net";

import { Constant, RedisCommand } from "../abstraction/constant";
import { RedisItemConfig } from "../abstraction/interface";
// import { RedisInfo } from "../abstraction/redisinfo";


import AbstractNode from "../node/abstraction";
import RedisItem from "../node/redis";
import RESP from '../redis/resp'
import Command from "../redis/command";
import utils from "../node/utils";
import Collection from "./collection";

class Connection implements TreeDataProvider<AbstractNode> {
    _onDidChangeTreeData: EventEmitter<AbstractNode> = new EventEmitter<AbstractNode>();
    readonly onDidChangeTreeData: Event<AbstractNode> = this._onDidChangeTreeData.event;

    private sockets = new Collection();
    private infos = new Collection();

    constructor(private context: ExtensionContext) { }
    getTreeItem(element: AbstractNode) {
        return element;
    }

    getChildren(element?: AbstractNode) {
        if (element) {
            return element.getChildren(this.sockets.get((element as RedisItem).id))
        }

        const config = this.getConfig() || {};
        return Object.keys(config).map(id => {
            return new RedisItem(id, config[id].name, this.infos.get(id), TreeItemCollapsibleState.Collapsed)
        })
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

        const socket = this.open(parseInt(port), host);
        const id = Date.now().toString();
        this.sockets.set(id, socket);

        const info = await this.getInfo(socket);
        this.infos.set(id, info);

        const config = this.getConfig();
        config[id] = { host, port: parseInt(port), auth, name };

        this.updateConfig(config);
        this.refresh();
    }

    delete(element: AbstractNode) {
        const config = this.getConfig();
        delete config[(element as RedisItem).id];
        this.updateConfig(config);
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

    private getConfig() {
        return this.context.globalState.get<{ [key: string]: RedisItemConfig }>(Constant.GLOBAL_STATE_REDIS_CONFIG_KEY) || {};
    }

    private updateConfig(config: { [key: string]: RedisItemConfig }) {
        this.context.globalState.update(Constant.GLOBAL_STATE_REDIS_CONFIG_KEY, config);
    }

    private open(port: number, host: string): Socket {
        const socket = connect(port, host);
        socket.setKeepAlive(true);
        socket.setTimeout(10000);
        socket.setNoDelay(true);

        socket.on('data', (buffer) => {
            RESP.decode(buffer);
        })

        return socket;
    }

    private async getInfo(socket: Socket) {
        const infostr = await Command.run(socket, RedisCommand.INFO);
        return utils.parseInfo(infostr)
    }
}

// class SocketCollection {
//     private sockets = {}
// }

export default Connection