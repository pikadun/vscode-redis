import { window, commands, ExtensionContext } from 'vscode';
import Manager from './manager/manager';
import AbstractNode from './node/abstraction';

export function activate(context: ExtensionContext) {
    const manager = new Manager(context);
    const { Connection } = manager

    window.registerTreeDataProvider('Connection', Connection);
    commands.registerCommand('Connection.Add', () => Connection.add());
    commands.registerCommand('Connection.Delete', (element: AbstractNode) => Connection.delete(element));
    // commands.registerCommand('RedisManager.CreateTerminal', (element: AbstractNode) => manager.delete(element));
}
