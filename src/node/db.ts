import { TreeItemContextValue } from 'src/abstraction/enum';
import { TreeItemCollapsibleState, ThemeIcon, window } from 'vscode';
import Command from 'src/common/command';
import RedisItem from './redis';
import KeyItem from './key';
import Element from 'src/manager/connection/element';

class DBItem extends Element {
    contextValue = TreeItemContextValue.DB;
    iconPath = new ThemeIcon('database');
    private cursor = 0;
    private pattern = '*';
    constructor(
        readonly id: string,
        readonly index: number,
        readonly root: RedisItem,
        readonly label: string,
        readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }

    async getChildren(): Promise<Element[]> {
        await Command.run(this.root.socket, `SELECT ${this.index}`);
        const cmd = `SCAN ${this.cursor} MATCH ${this.pattern} COUNT 1000`;
        const keys = await Command.run<[number, string[]]>(this.root.socket, cmd);
        this.cursor = keys[0];

        const result = keys[1].map((key: string) => {
            return new KeyItem(`${this.id}.${key}`, this.root, this, key, TreeItemCollapsibleState.None);
        });
        return result;
    }

    /**
     * Open a input box and search the pattern.
     */
    async search(): Promise<void> {
        const pattern = await window.showInputBox({
            prompt: 'pattern',
            value: this.pattern,
        });

        if (pattern === undefined) {
            return;
        }

        this.cursor = 0;
        this.pattern = pattern || '*';
        this.refresh(this);
    }
}

export default DBItem;