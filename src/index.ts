import { window, commands, ExtensionContext } from 'vscode';
import RedisManager from './manager';
import { AbstractNode } from './tree';

export function activate(context: ExtensionContext) {
    const manager = new RedisManager(context);
    window.registerTreeDataProvider('RedisManager', manager);
    commands.registerCommand('RedisManager.AddConnection', () => manager.addConnection());
    commands.registerCommand('RedisManager.Delete', (element: AbstractNode) => manager.delete(element));
}