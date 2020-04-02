export interface RedisConfig {
    host: string;
    port: number;
    auth?: string;
}

export interface RedisItemConfig extends RedisConfig {
    name: string,
}

