import { ExtensionContext } from 'vscode';
import Manager from '../manager';
import { RedisDataType } from './enum';

export interface RedisConfig {
    host: string;
    port: number;
    auth?: string;
}

export interface RedisItemConfig extends RedisConfig {
    name: string;
}

export interface RESPObject {
    offset: number;
    buffer: Buffer;
}

export interface Context extends ExtensionContext {
    manager: Manager;
}

export interface RedisData {
    key: string;
    type: RedisDataType;
    value: string;
}

export interface PanelOptions {
    redisData?: RedisData;
}

export interface InputAttributes {
    type: string;
    value: string | number;
    disabled: boolean;
    readonly: boolean;
    
}
