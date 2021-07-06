import { ExtensionContext, window, commands, Uri, env } from 'vscode';
import Constant from './common/constant';
import PanelName from './common/panelName';
import Panel from './panel';
import Terminal from './terminal';
import { ConnectionConfig } from './tree/config';
import DBItem from './tree/db';
import KeyItem from './tree/key';
import Provider from './tree/provider';
import RedisItem from './tree/redis';

export function activate(context: ExtensionContext): void {
    const provider = new Provider(context);
    const panel = new Panel(context);
    const terminal = new Terminal(context);

    window.registerTreeDataProvider('RedisExplorer', provider);

    // Connection settings page 
    commands.registerCommand('Redis.Connection.Settings.Add', () => panel.show(PanelName.SETTINGS));
    commands.registerCommand('Redis.Connection.Settings.Edit', (element: RedisItem) => {
        const { id, config: { name, host, port, password } } = element;
        panel.show(PanelName.SETTINGS, { id, name, host, port, password });
    });

    // Test connection
    commands.registerCommand('Redis.Connection.Test', (config: ConnectionConfig) => provider.test(config));

    // Add or update connection
    commands.registerCommand('Redis.Connection.Add', (...args: [string, ConnectionConfig]) => {
        provider.add(args);
        panel.close();
    });

    // Delete a connection
    commands.registerCommand('Redis.Connection.Delete', (element: RedisItem) => provider.delete(element.id));

    // Reload server
    commands.registerCommand('Redis.Connection.Reload', (element: RedisItem) => element.refresh());

    // DB keys filter
    commands.registerCommand('Redis.DB.Filter', (element: DBItem) => element.filter());

    // Reload DB keys
    commands.registerCommand('Redis.DB.Reload', (element: DBItem) => element.refresh());

    // View key detail
    commands.registerCommand('Redis.Key.Detail', async (element: KeyItem) => {
        const detail = await element.detail();
        panel.show(detail.type, detail.data);
    });

    // Rename key
    commands.registerCommand('Redis.Key.Rename', async (id: string) => {
        const element = provider.getTreeItemById(id) as KeyItem;
        const executed = await element.rename();
        if (executed) {
            const detail = await element.detail();
            panel.show(detail.type, detail.data);
        }
    });

    // Update ttl
    commands.registerCommand('Redis.Key.Expire', async (id: string, ttl: string) => {
        const element = provider.getTreeItemById(id) as KeyItem;
        const executed = await element.expire(ttl);
        if (executed) {
            const detail = await element.detail();
            panel.show(detail.type, detail.data);
        }
    });

    // Reload key
    commands.registerCommand('Redis.Key.Reload', async (id: string) => {
        const element = provider.getTreeItemById(id) as KeyItem;
        const detail = await element.detail();
        panel.show(detail.type, detail.data);
    });

    // Delete key
    commands.registerCommand('Redis.Key.Delete', async (id: string) => {
        const element = provider.getTreeItemById(id) as KeyItem;
        const deleted = await element.delete();
        if (deleted) {
            panel.close();
        }
    });

    // Open terminal
    commands.registerCommand('Redis.Terminal', (element: RedisItem) => terminal.show(element));

    // Star
    commands.registerCommand('Redis.Star', () => {
        const url = Uri.parse(Constant.GITHUB_REPO);
        env.openExternal(url);
    });

    // Issue
    commands.registerCommand('Redis.Issue', () => {
        const url = Uri.parse(Constant.GITHUB_REPO + '/issues');
        env.openExternal(url);
    });
}