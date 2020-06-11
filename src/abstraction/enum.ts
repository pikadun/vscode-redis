export enum Constant {
    GLOBAL_STATE_REDIS_CONFIG_KEY = 'redis-configs',
    FEEDBACK_URI = 'https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAANGTi_hUMENKQ1BNNTk2RTFBQkNPNE1RNkNGUFdPVy4u'
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
    SELECT = 'SELECT ',
    GET = 'GET '
}

export enum RedisPanel {
    SERVER_INFO = 'SERVER_INFO',
    KEY_INFO = 'KEY_INFO',
    CONNECTION = 'CONNECTION'
}

export enum RedisDataType {
    STRING = 'string',
    LIST = 'list',
    HASH = 'hash',
    SET = 'set',
    ZSET = 'zset'
}