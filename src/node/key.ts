import AbstractNode from './abstraction';
import { TreeItemCollapsibleState, Command as VScodeCommand, ThemeIcon } from 'vscode';
import { TreeItemContextValue, RedisPanel, RedisType } from '../abstraction/enum';
import RedisItem from './redis';
import DBItem from './db';
import Command from '../redis/command';
import Panel from '../manager/panel';
import { RedisDataType, HASH } from '../abstraction/interface';

class KeyItem extends AbstractNode {
    readonly command: VScodeCommand = {
        title: 'View Key Detail',
        command: 'Key.Detail',
        arguments: []
    };
    readonly contextValue = TreeItemContextValue.KEY;
    readonly iconPath = new ThemeIcon('key');
    constructor(
        readonly id: string,
        readonly root: RedisItem,
        readonly db: DBItem,
        readonly label: string,
        readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.command.arguments?.push(this);
    }

    /**
     * @todo Split the key by ':' and group them
     */
    getChildren(): Promise<AbstractNode[]> {
        throw new Error('Method not implemented.');
    }

    public async detail(panel: Panel): Promise<void> {
        await Command.run(this.root.socket, `SELECT ${this.db.index}`);

        const type = await Command.run<string>(this.root.socket, `TYPE ${this.label}`);
        const ttl = await Command.run<number>(this.root.socket, `TTL ${this.label}`);
        let data: RedisDataType;

        switch (type) {
            case RedisType.STRING:
                data = await this.string();
                break;
            case RedisType.HASH:
                data = await this.hash();
                break;
            default:
                data = 'Method not implemented.';
        }

        panel.show(RedisPanel.KEY_INFO, {
            data: { type: type as RedisType, key: this.label, value: data, ttl }
        });
    }

    private async string(): Promise<RedisDataType> {
        const data = await Command.run<string>(this.root.socket, `GET ${this.label}`);
        return data;
    }

    private async hash(): Promise<RedisDataType> {
        const data = await Command.run<string[]>(this.root.socket, `HGETALL ${this.label}`);
        const result: HASH = Object.create(null);

        for (let i = 0; i < data.length; i++) {
            result[data[i]] = data[++i];
        }

        return result;
    }
}

export default KeyItem;