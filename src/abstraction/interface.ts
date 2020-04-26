import { ExtensionContext } from "vscode";
import Manager from "../manager/manager";

export interface RedisConfig {
    host: string;
    port: number;
    auth?: string;
}

export interface RedisItemConfig extends RedisConfig {
    name: string,
}

export interface RESPObject {
    offset: number,
    buffer: Buffer
}

export interface Context extends ExtensionContext {
    manager: Manager
}
