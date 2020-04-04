import path from "path";
import { Socket } from "net";
import AbstractNode from "./abstraction";
import { TreeItemContextValue, RedisCommand } from "../abstraction/constant";
import { TreeItemCollapsibleState } from "vscode";
import Command from "../redis/command";
import RedisItem from "./redis";
import { KeyItem } from "./key";

class DBItem extends AbstractNode {

    contextValue = TreeItemContextValue.DB;
    iconPath = path.join(__dirname, '..', '..', 'resources', `${this.contextValue}.png`);
    children: DBItem[]
    constructor(
        readonly id: string,
        readonly parent: RedisItem,
        readonly label: string,
        readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.children = [];
    }

    async getChildren(socket: Socket): Promise<AbstractNode[]> {
        await Command.run(socket, RedisCommand.SELECT + this.id);
        const keys: string[] = await Command.run(socket, RedisCommand.KEYS);
        const result = keys.sort().map((key: string) => { return new KeyItem(key, TreeItemCollapsibleState.None) })
        return result;
    }
}

export default DBItem