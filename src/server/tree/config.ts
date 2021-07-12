import { ExtensionContext } from 'vscode';
import Constant from '../common/constant';

export interface ConnectionConfig {
    host: string;
    port: number;
    password?: string;
    name: string;
}

export default class ConnectionConfigStore {
    constructor(private context: ExtensionContext) { }

    all(): { [id: string]: ConnectionConfig } {
        return this.context.globalState.get<{ [id: string]: ConnectionConfig }>(
            Constant.GLOBAL_STATE_REDIS_CONFIG_KEY
        ) || {};
    }

    get(id: string): ConnectionConfig | undefined {
        const configs = this.all();
        return configs[id];
    }

    set(id: string, config: ConnectionConfig): void {
        const configs = this.all();
        config.host = config.host || '127.0.0.1';
        config.port = config.port || 6379;
        config.name = config.name || `${config.host}:${config.port}`;
        configs[id] = config;
        this.context.globalState.update(Constant.GLOBAL_STATE_REDIS_CONFIG_KEY, configs);
    }

    delete(id: string): void {
        const configs = this.all();
        delete configs[id];
        this.context.globalState.update(Constant.GLOBAL_STATE_REDIS_CONFIG_KEY, configs);
    }
}