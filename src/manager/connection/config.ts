import { ExtensionContext } from 'vscode';
import { RedisConfig } from 'src/abstraction/interface';
import { Constant } from 'src/abstraction/enum';

class Config {
    constructor(private context: ExtensionContext) { }
    all(): { [key: string]: RedisConfig } {
        return this.context.globalState.get<{ [key: string]: RedisConfig }>(Constant.GLOBAL_STATE_REDIS_CONFIG_KEY) || {};
    }

    get(id: string): RedisConfig {
        const configs = this.all();
        return configs[id];
    }

    set(id: string, config: RedisConfig): void {
        const configs = this.all();
        configs[id] = config;
        this.context.globalState.update(Constant.GLOBAL_STATE_REDIS_CONFIG_KEY, configs);
    }

    delete(id: string): void {
        const configs = this.all();
        delete configs[id];
        this.context.globalState.update(Constant.GLOBAL_STATE_REDIS_CONFIG_KEY, configs);
    }
}

export default Config;