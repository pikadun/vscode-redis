import { window, commands, ExtensionContext, env, Uri } from 'vscode';
import Manager from './manager';
import KeyItem from './node/key';
import DBItem from './node/db';
import { ConnectionOptions, RedisConfig } from './abstraction/interface';
import { Constant } from './abstraction/enum';
import RedisItem from './node/redis';

export function activate(context: ExtensionContext): void {
    const manager = new Manager(context);
    const { Connection, Panel, Terminal } = manager;

    // tree
    window.registerTreeDataProvider('RedisExplorer', Connection);
    commands.registerCommand('Redis.Connection.Add', () => Connection.edit(Panel));
    commands.registerCommand('Redis.Connection.Edit', (...args: ConnectionOptions) => { Connection.add(args); });
    commands.registerCommand('Redis.Connection.Test', (config: RedisConfig) => { Connection.test(config); });
    commands.registerCommand('Redis.Connection.Delete', (element: RedisItem) => Connection.delete(element));
    commands.registerCommand('Redis.DB.Reload', (element: DBItem) => Connection.refresh(element));
    commands.registerCommand('Redis.DB.Search', (element: DBItem) => element.search());
    commands.registerCommand('Redis.Key.Delete', async (element: KeyItem) => {
        await element.delete() && Connection.refresh(element.db);
    });

    // view
    commands.registerCommand('Redis.Key.Detail', (element: KeyItem) => element.detail(Panel));

    // terminal
    commands.registerCommand('Redis.Terminal', async (element: RedisItem) => {
        await element.init();
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
