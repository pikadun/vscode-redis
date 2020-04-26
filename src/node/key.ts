import AbstractNode from './abstraction';
import { TreeItemCollapsibleState, Command as VScodeCommand } from 'vscode';
import { TreeItemContextValue, RedisCommand, RedisPanel, RedisDataType } from '../abstraction/enum';
import path from 'path';
import RedisItem from './redis';
import DBItem from './db';
import Command from '../redis/command';
import Panel from '../manager/panel';

class KeyItem extends AbstractNode {
    readonly command: VScodeCommand = {
        title: 'View Key Detail',
        command: 'Key.Detail',
        arguments: []
    };
    readonly contextValue = TreeItemContextValue.KEY;
    readonly iconPath = path.join(__dirname, '..', '..', 'resources', 'image', `${this.contextValue}.png`);
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
        await Command.run(this.root.socket, RedisCommand.SELECT + this.db.index);
        const detail = await Command.run<string>(this.root.socket, RedisCommand.GET + this.label);
        panel.show(RedisPanel.KEY_INFO, {
            redisData: {
                key: this.label,
                type: RedisDataType.STRING,
                value: detail
            }
        });
    }
}

export default KeyItem;