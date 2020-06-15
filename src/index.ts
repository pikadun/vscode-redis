import { window, commands, ExtensionContext, env, Uri } from 'vscode';
import Manager from './manager';
import AbstractNode from './node/abstraction';
import KeyItem from './node/key';
import DBItem from './node/db';
import { ConnectionOptions } from './abstraction/interface';
import { Constant } from './abstraction/enum';
import RedisItem from './node/redis';

export function activate(context: ExtensionContext): void {
    const manager = new Manager(context);
    const { Connection, Panel, Terminal } = manager;

    // tree
    window.registerTreeDataProvider('Connection', Connection);
    commands.registerCommand('Connection.Add', () => Connection.edit(Panel));
    commands.registerCommand('Connection.Edit', (...args: ConnectionOptions) => { Connection.add(args); });
    commands.registerCommand('Connection.Delete', (element: AbstractNode) => Connection.delete(element));
    commands.registerCommand('DB.Reload', (element: DBItem) => Connection.refresh(element));

    // view
    commands.registerCommand('Key.Detail', (element: KeyItem) => element.detail(Panel));

    // terminal
    commands.registerCommand('Connection.Terminal', async (element: RedisItem) => {
        if (!element.socket) {
            [element.socket, element.info] = await Connection.init(element.id);
        }
        Terminal.show(element);
    });

    // feedback
    commands.registerCommand('VR.Feedback', () => {
        const uri = Uri.parse(Constant.FEEDBACK_URI);
        env.openExternal(uri);
    });
}
