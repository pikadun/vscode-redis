import { ExtensionContext } from 'vscode';
import Manager from 'src/manager';
import { RedisType } from './enum';

export interface RedisConfig {
    host: string;
    port: number;
    auth: string;
    name: string;
}

export interface RESPObject {
    offset: number;
    buffer: Buffer;
}

export interface Context extends ExtensionContext {
    manager: Manager;
}

/**
 * Connection Options
 */
export type ConnectionOptions = [string, RedisConfig];

export interface RedisData {
    type: RedisType;
    key: string;
    value: RedisDataType;
    ttl: number;
}

export interface PanelOptions {
    data?: RedisData;
    connection?: RedisConfig;
}

export interface HASH {
    [x: string]: string;
}

export type RedisDataType = string | HASH;
