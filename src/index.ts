import { window, commands, ExtensionContext } from 'vscode';
import RedisManager from './manager/manager';
import AbstractNode from './node/abstraction';

export function activate(context: ExtensionContext) {
    const manager = new RedisManager(context);
    window.registerTreeDataProvider('RedisManager', manager);
    commands.registerCommand('RedisManager.AddConnection', () => manager.addConnection());
    commands.registerCommand('RedisManager.Delete', (element: AbstractNode) => manager.delete(element));
}