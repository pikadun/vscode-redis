import { TreeItemContextValue } from 'src/abstraction/enum';
import { TreeItemCollapsibleState, ThemeIcon, window } from 'vscode';
import RedisItem from './redis';
import KeyItem from './key';
import Element from 'src/manager/connection/element';

class DBItem extends Element {
    contextValue = TreeItemContextValue.DB;
    iconPath = new ThemeIcon('database');
    private cursor = 0;
    private pattern = '*';
    constructor(
        readonly root: RedisItem,
        readonly index: number,
        readonly label: string,
        readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.id = `${root.id}.${index}`;

    }

    async getChildren(): Promise<Element[]> {
        await this.root.run(`SELECT ${this.index}`);
        const cmd = `SCAN ${this.cursor} MATCH ${this.pattern} COUNT 1000`;
        const keys = await this.root.run<[number, string[]]>(cmd);
        this.cursor = keys[0];

        const result = keys[1].map((key: string) => {
            return new KeyItem(this.root, this, key, TreeItemCollapsibleState.None);
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