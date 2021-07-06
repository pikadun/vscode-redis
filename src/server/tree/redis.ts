import { ClientV2 } from '@camaro/redis';
import { join } from 'path';
import { TreeItemCollapsibleState } from 'vscode';
import { TreeItemContextValue } from '../common/treeItemContextValue';
import { ConnectionConfig } from './config';
import DBItem from './db';
import Element from './element';

interface Client {
    [x: string]: (...args: unknown[]) => Promise<unknown>
}

export default class RedisItem extends Element {
    contextValue = TreeItemContextValue.REDIS;
    iconPath = join(__dirname, `../../../img/${this.contextValue}.png`);
    private client!: ClientV2 & Client;
    constructor(
        readonly id: string,
        readonly config: ConnectionConfig
    ) {
        super(config.name, TreeItemCollapsibleState.Collapsed);
    }

    async getChildren(): Promise<Element[]> {
        await this.connect();

        this.client.options.reconnection = true;
        const [keyspaceStr, info] = await Promise.all([
            this.client.INFO('keyspace'),
            this.client.CONFIG('get', 'databases')
        ]);

        const keyspace = this.parseKeyspace(keyspaceStr);
        const count = parseInt(info[1] as string);
        const result: DBItem[] = [];
        for (let i = 0; i < count; i++) {
            const db = new DBItem(this.id, this.client, i, keyspace[`db${i}`]?.keys || 0);
            result.push(db);
        }
        return result;
    }

    async test(): Promise<string> {
        await this.connect();
        return this.client.INFO('server');
    }

    /**
     * Connect before use
     */
    async connect(reconnection?: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client = new ClientV2(this.config) as ClientV2 & Client;
            this.client.options.reconnection = !!reconnection;
            this.client.on('error', e => {
                reject(e + '');
            });
            this.client.on('connect', () => {
                resolve();
            });
        });
    }

    private parseKeyspace(str: string) {
        const result = Object.create(null);
        const lines = str.split('\r\n');
        lines.shift();
        lines.pop();
        lines.forEach(e => {
            const [name, info] = e.split(':') as [string, string];
            result[name] = Object.create(null);
            info.split(',').forEach(e => {
                const key = e.split('=') as [string, string];
                result[name][key[0]] = key[1];
            });
        });
        return result;
    }

    async run(command: string, args: string[]): Promise<unknown> {
        return this.client[command]?.(...args);
    }

    dispose(): void {
        this.client.options.reconnection = false;
        this.client.QUIT();
    }
}