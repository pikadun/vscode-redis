import { ClientV2 } from '@camaro/redis';
import { ThemeIcon, TreeItemCollapsibleState, window } from 'vscode';
import { TreeItemContextValue } from '../common/treeItemContextValue';
import Element from './element';
import KeyItem from './key';

export default class DBItem extends Element {
    contextValue = TreeItemContextValue.DB;
    iconPath = new ThemeIcon('database');
    private cursor = 0;
    private pattern = '*';
    constructor(
        parentId: string,
        private client: ClientV2,
        readonly index: number,
        private dbsize: number
    ) {
        super(`db${index} (${dbsize})`, TreeItemCollapsibleState.Collapsed);
        this.id = `${parentId}.${index}`;
    }

    async getChildren(): Promise<Element[]> {
        await this.client.SELECT(this.index);
        const keys = await this.client.SCAN(this.cursor, 'match', this.pattern, 'count', 1000);
        this.cursor = parseInt(keys[0]);
        return keys[1].map(key => new KeyItem(`${this.id}.${key}`, key, this.client, this));
    }

    async filter(): Promise<void> {
        const pattern = await window.showInputBox({
            prompt: 'pattern',
            value: this.pattern,
        });
        if (pattern === undefined) {
            return;
        }
        this.cursor = 0;
        this.pattern = pattern || '*';

        this.refresh();
    }

    async beforeRefresh(): Promise<void> {
        await this.client.SELECT(this.index);
        this.dbsize = await this.client.DBSIZE();
        if (this.pattern === '*') {
            this.label = `db${this.index} (${this.dbsize})`;
        } else {
            this.label = `db${this.index} [filter:${this.pattern}] (${this.dbsize})`;
        }
    }
}