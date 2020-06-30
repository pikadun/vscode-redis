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
    const { ConnectionProvider, Panel, Terminal } = manager;

    // tree
    window.registerTreeDataProvider('RedisExplorer', ConnectionProvider);
    commands.registerCommand('Redis.Connection.Add', () => ConnectionProvider.edit(Panel));
    commands.registerCommand('Redis.Connection.Edit', (...args: ConnectionOptions) => { ConnectionProvider.add(args); });
    commands.registerCommand('Redis.Connection.Delete', (element: AbstractNode) => ConnectionProvider.delete(element));
    commands.registerCommand('Redis.DB.Reload', (element: DBItem) => ConnectionProvider.refresh(element));
    commands.registerCommand('Redis.DB.Search', (element: DBItem) => element.search());

    // view
    commands.registerCommand('Redis.Key.Detail', (element: KeyItem) => element.detail(Panel));

    // terminal
    commands.registerCommand('Redis.Terminal', async (element: RedisItem) => {
        if (!element.socket) {
            [element.socket, element.info] = await ConnectionProvider.init(element.id);
        }
        Terminal.show(element);
    });

    // feedback
    commands.registerCommand('Redis.Feedback', () => {
        const uri = Uri.parse(Constant.FEEDBACK_URI);
        env.openExternal(uri);
    });
    // github
    commands.registerCommand('Redis.Star', () => {
        const uri = Uri.parse(Constant.GITHUB_REPO);
        env.openExternal(uri);
    });
}
