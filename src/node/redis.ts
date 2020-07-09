import path from 'path';
import { TreeItemContextValue } from 'src/abstraction/enum';
import { RedisInfo } from 'src/abstraction/redisinfo';
import { TreeItemCollapsibleState } from 'vscode';
import command from 'src/common/command';
import DBItem from './db';
import { Socket } from 'net';
import Element from 'src/manager/connection/element';

class RedisItem extends Element {
    contextValue = TreeItemContextValue.REDIS;
    iconPath = path.join(__dirname, '..', 'img', `${this.contextValue}.png`);
    info!: RedisInfo;
    socket!: Socket;
    constructor(
        readonly id: string,
        readonly name: string,
        readonly collapsibleState: TreeItemCollapsibleState,
        public refresh: (e: Element) => void
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