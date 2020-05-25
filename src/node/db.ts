import path from 'path';
import AbstractNode from './abstraction';
import { TreeItemContextValue } from '../abstraction/enum';
import { TreeItemCollapsibleState } from 'vscode';
import Command from '../redis/command';
import RedisItem from './redis';
import KeyItem from './key';

class DBItem extends AbstractNode {
    contextValue = TreeItemContextValue.DB;
    iconPath = path.join(__dirname, '..', 'resources', 'image', `${this.contextValue}.png`);
    cursor = '0';
    constructor(
        readonly id: string,
        readonly index: number,
        readonly root: RedisItem,
        readonly label: string,
        readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }

    async getChildren(pattern: string): Promise<AbstractNode[]> {
        await Command.run(this.root.socket, `SELECT ${this.index}`);
        const cmd = `SCAN ${this.cursor} MATCH ${pattern} COUNT 1000`;
        const keys = await Command.run<[string, string[]]>(this.root.socket, cmd);
        this.cursor = keys[0];

        const result = keys[1].map((key: string) => {
            return new KeyItem(`${this.id}.${key}`, this.root, this, key, TreeItemCollapsibleState.None);
        });
        return result;
    }
}

export default DBItem;