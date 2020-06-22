import path from 'path';
import AbstractNode from './abstraction';
import { TreeItemContextValue } from '../abstraction/enum';
import { RedisInfo } from '../abstraction/redisinfo';
import { TreeItemCollapsibleState } from 'vscode';
import command from '../redis/command';
import DBItem from './db';
import { Socket } from 'net';

class RedisItem extends AbstractNode {
    contextValue = TreeItemContextValue.REDIS;
    iconPath = path.join(__dirname, '..', 'resources', 'image', `${this.contextValue}.png`);
    info!: RedisInfo;
    socket!: Socket;
    constructor(
        readonly id: string,
        readonly name: string,
        readonly collapsibleState: TreeItemCollapsibleState,
        public refresh: (e: AbstractNode) => void
    ) {
        super(name, collapsibleState);
    }

    async getChildren(): Promise<DBItem[]> {
        const dbInfo = await command.run<string>(this.socket, 'CONFIG GET databases');
        const count = parseInt(dbInfo[1]);
        const result: DBItem[] = [];
        for (let i = 0; i < count; i++) {
            const dbName = `db${i}`;
            const db = new DBItem(
                `${this.id}.${i}`, i, this,
                `${dbName}(${this.info.Keyspace[dbName]?.keys || 0})`,
                TreeItemCollapsibleState.Collapsed
            );
            result.push(db);
        }
        return result;
    }
}

export default RedisItem;