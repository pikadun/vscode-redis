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

export type TypeRedisData = string | HASH;

export interface RedisData {
    type: RedisDataType;
    key: string;
    value: TypeRedisData;
}

export interface HASH {
    [x: string]: string;
}

export interface InputAttributes {
    type: string;
    value: string | number;
    disabled: boolean;
    readonly: boolean;
}