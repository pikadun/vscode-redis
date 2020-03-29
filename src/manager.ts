import {
    ExtensionContext,
    TreeDataProvider,
    TreeItemCollapsibleState,
    window,
    EventEmitter,
    Event
} from 'vscode';
import { Constant, TreeItemContextValue } from './constant';
import { RedisItem, AbstractNode } from './tree';

interface RedisConfig {
    name: string;
    host: string;
    port: string;
    auth?: string;
}


class RedisManager implements TreeDataProvider<AbstractNode> {

    _onDidChangeTreeData: EventEmitter<AbstractNode> = new EventEmitter<AbstractNode>();
    readonly onDidChangeTreeData: Event<AbstractNode> = this._onDidChangeTreeData.event;

    constructor(private context: ExtensionContext) { }
    getTreeItem(element: AbstractNode) {
        return element;
    }

    getChildren(element?: AbstractNode) {
        if (element) {
            return element.getChildren()
        } else {
            const config = this.getConfig() || {};
            return Object.keys(config).map(id => {
                return new RedisItem(id, config[id].host, parseInt(config[id].port), config[id].name, TreeItemCollapsibleState.Collapsed)
            })
        }

    }

    async addConnection() {
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
        const config = this.getConfig()

        config[id] = { host, port, auth, name };

        this.updateConfig(config);
        this.refresh();
    }

    delete(element: AbstractNode) {
        if (element.contextValue === TreeItemContextValue.REDIS) {
            const config = this.getConfig();
            delete config[(element as RedisItem).id];
            this.updateConfig(config);
            this.refresh();
        } else if (element.contextValue === TreeItemContextValue.DB) {
        } else if (element.contextValue === TreeItemContextValue.KEY) {

        }
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
        return this.context.globalState.get<{ [key: string]: RedisConfig }>(Constant.GLOBAL_STATE_REDIS_CONFIG_KEY) || {};
    }

    private updateConfig(config: { [key: string]: RedisConfig }) {
        this.context.globalState.update(Constant.GLOBAL_STATE_REDIS_CONFIG_KEY, config);
    }
}

export default RedisManager
