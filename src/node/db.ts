import path from "path";
import AbstractNode from "./abstraction";
import { TreeItemContextValue, RedisCommand } from "../abstraction/constant";
import { TreeItemCollapsibleState } from "vscode";
import Command from "../redis/command";
import RedisItem from "./redis";
import KeyItem from "./key";

class DBItem extends AbstractNode {

    contextValue = TreeItemContextValue.DB;
    iconPath = path.join(__dirname, '..', '..', 'resources', 'image', `${this.contextValue}.png`);
    constructor(
        readonly id: string,
        readonly root: RedisItem,
        readonly label: string,
        readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }

    async getChildren(): Promise<AbstractNode[]> {
        await Command.run(this.root.socket, RedisCommand.SELECT + this.id);
        const keys: string[] = await Command.run(this.root.socket, RedisCommand.KEYS);
        const result = keys.sort().map((key: string) => { return new KeyItem(this.root, this, key, TreeItemCollapsibleState.None) })
        return result;
    }
}

export default DBItem