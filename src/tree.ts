import { TreeItem, TreeItemCollapsibleState } from "vscode";
import path from "path";

import Command from './command'
import { TreeItemContextValue, RedisCommand } from "./constant";

export abstract class AbstractNode extends TreeItem {
    abstract getChildren(): Promise<AbstractNode[]>;
}

export class RedisItem extends AbstractNode {
    contextValue = TreeItemContextValue.REDIS;
    iconPath = path.join(__dirname, '..', 'resources', `${this.contextValue}.png`);
    constructor(
        readonly id: string,
        private readonly host: string,
        private readonly port: number,
        readonly label: string,
        readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }

    async getChildren() {
        const config = { host: this.host, port: this.port }
        const db = await Command.run(RedisCommand.CONFIG_GET_DATABASES, config);
        const keyspace = await Command.run(RedisCommand.INFO_KEYSPACE, config);
        console.log(db);
        console.log(keyspace);
        return Promise.resolve([])
    }
}

export class DBItem extends AbstractNode {
    contextValue = TreeItemContextValue.DB;
    iconPath = path.join(__dirname, '..', 'resources', `${this.contextValue}.png`);
    constructor(
        readonly id: string,
        readonly label: string,
        readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }

    getChildren(): Promise<AbstractNode[]> {
        throw new Error("Method not implemented.");
    }
}

export class KeyItem extends AbstractNode {
    contextValue = TreeItemContextValue.KEY;
    iconPath = path.join(__dirname, '..', 'resources', `${this.contextValue}.png`);
    constructor(
        readonly id: string,
        readonly label: string,
        readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }

    getChildren(): Promise<AbstractNode[]> {
        throw new Error("Method not implemented.");
    }
}