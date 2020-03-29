import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { TreeItemContextValue } from "./constant";
import path from "path";

export abstract class AbstractNode extends TreeItem {
    abstract getChildren(): Promise<AbstractNode[]>;
}

export class RedisItem extends AbstractNode {
    contextValue = TreeItemContextValue.REDIS;
    iconPath = path.join(__dirname, '..', 'resources', `${this.contextValue}.png`);
    constructor(
        readonly id: string,
        readonly label: string,
        readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }

    getChildren(): Promise<AbstractNode[]> {
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