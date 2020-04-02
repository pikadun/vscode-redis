import path from "path";
import AbstractNode from "./abstraction";
import { TreeItemContextValue, RedisCommand } from "../abstraction/constant";
import { RedisInfo } from "../abstraction/redisinfo";
import { RedisItemConfig } from "../abstraction/interface";
import { TreeItemCollapsibleState } from "vscode";
import Command from '../redis/command';

class RedisItem extends AbstractNode {
    contextValue = TreeItemContextValue.REDIS;
    iconPath = path.join(__dirname, '..', 'resources', `${this.contextValue}.png`);
    private info!: RedisInfo;
    constructor(
        readonly id: string,
        private readonly config: RedisItemConfig,
        readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(config.name, collapsibleState);
        this.getInfo();
    }

    async getChildren() {
        const db = await Command.run(RedisCommand.CONFIG_GET_DATABASES, this.config);
        await this.getInfo();

        console.log(db);
        return Promise.resolve([])
    }

    private async getInfo() {
        console.log(this.info)
    }
}

export default RedisItem