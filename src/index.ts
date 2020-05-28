import { window, commands, ExtensionContext } from 'vscode';
import Manager from './manager';
import AbstractNode from './node/abstraction';
import KeyItem from './node/key';
import DBItem from './node/db';

export function activate(context: ExtensionContext): void {
    const manager = new Manager(context);
    const { Connection, Panel } = manager;

    // tree
    window.registerTreeDataProvider('Connection', Connection);
    commands.registerCommand('Connection.Add', () => Connection.edit(Panel));
    commands.registerCommand('Connection.Test', Connection.test);
    commands.registerCommand('Connection.Delete', (element: AbstractNode) => Connection.delete(element));
    commands.registerCommand('DB.Reload', (element: DBItem) => Connection.refresh(element));

    // view
    commands.registerCommand('Key.Detail', (element: KeyItem) => element.detail(Panel));
    // terminal
}
