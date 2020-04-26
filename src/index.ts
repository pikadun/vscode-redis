import { window, commands, ExtensionContext } from 'vscode';
import Manager from './manager/manager';
import AbstractNode from './node/abstraction';
import KeyItem from './node/key';

export function activate(context: ExtensionContext) {
    const manager = new Manager(context);
    const { Connection, Panel } = manager;

    // tree
    window.registerTreeDataProvider('Connection', Connection);
    commands.registerCommand('Connection.Add', () => Connection.add());
    commands.registerCommand('Connection.Delete', (element: AbstractNode) => Connection.delete(element));
    // view
    commands.registerCommand('Key.Detail', (element: KeyItem) => element.detail(Panel))
    // terminal
}
