export enum Constant {
    GLOBAL_STATE_REDIS_CONFIG_KEY = 'redis-configs'
}

export enum TreeItemContextValue {
    REDIS = 'redis',
    DB = 'db',
    KEY = 'key'
}

export enum RedisCommand {
    CONFIG_GET_DATABASES = 'CONFIG GET DATABASES',
    INFO = 'INFO',
    KEYS = 'KEYS *',
    SELECT = 'SELECT '
}
