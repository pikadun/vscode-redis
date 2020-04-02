import path from "path";
import AbstractNode from "./abstraction";
import { TreeItemContextValue, RedisCommand } from "../abstraction/constant";
import { RedisInfo } from "../abstraction/redisinfo";
import { RedisItemConfig } from "../abstraction/interface";
import { TreeItemCollapsibleState } from "vscode";
import command from '../redis/command';
import utils from "./utils";
import { DBItem } from "./db";

class RedisItem extends AbstractNode {
    contextValue = TreeItemContextValue.REDIS;
    iconPath = path.join(__dirname, '..', '..', 'resources', `${this.contextValue}.png`);
    private info!: RedisInfo;
    constructor(
        readonly id: string,
        private readonly config: RedisItemConfig,
        readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(config.name, collapsibleState);
    }


    async getChildren() {
        const dbInfo = await command.run(RedisCommand.CONFIG_GET_DATABASES, this.config);
        await this.getInfo();
        let count = parseInt(dbInfo[1]);
        const result: DBItem[] = [];
        for (let i = 0; i < count; i++) {
            const dbName = `db${i}`;
            const db = new DBItem(
                `${this.id}.${i}`,
                `${dbName}(${this.info.Keyspace[dbName]?.keys || 0})`,
                TreeItemCollapsibleState.Collapsed
            )
            result.push(db);
        }
        return result
    }

    private async getInfo() {
        const infostr = await command.run(RedisCommand.INFO, this.config);
        this.info = utils.parseInfo(infostr);
    }

}

export default RedisItem