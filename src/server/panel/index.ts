import path from 'path';
import fs from 'fs';
import { commands, ExtensionContext, Uri, ViewColumn, WebviewPanel, window } from 'vscode';
import PanelName from '../common/panelName';

export default class Panel {

    private readonly viewType = 'RedisView';
    private readonly baseTitle = 'Redis';
    private readonly basePath: string;
    private readonly viewPath: string;
    private panel!: WebviewPanel;
    private panelDisPosed = true;

    constructor(context: ExtensionContext) {
        this.basePath = context.extensionPath;
        this.viewPath = path.join(this.basePath, 'lib/client');
    }

    private create(): void {
        const panel = window.createWebviewPanel(
            this.viewType,
            this.baseTitle,
            ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.iconPath = Uri.file(path.resolve(this.basePath, 'img', 'redis.png'));

        panel.onDidDispose(() => {
            this.panelDisPosed = true;
        });

        panel.webview.onDidReceiveMessage(message => {
            if (!message.self) {
                return;
            }
            commands.executeCommand(message.command, ...message.args);
        });

        this.panelDisPosed = false;
        this.panel = panel;
    }

    /**
     * Show a redis panel
     * @param name panel name
     */
    show(name: PanelName, data?: unknown): void {
        if (this.panelDisPosed) {
            this.create();
        }
        const html = this.getWebViewContent();
        const common = { self: true, panelName: name };
        let title = '';
        this.panel.reveal(ViewColumn.One);
        switch (name) {
            case PanelName.SETTINGS:
                title = data ? 'Edit Connection Settings' : 'New Connection Settings';
                break;
            case PanelName.STRING:
                title = (data as { key: string }).key;
        }
        this.panel.title = this.baseTitle + (title ? ` - ${title}` : '');
        this.panel.webview.html = html;
        this.panel.webview.postMessage(Object.assign(common, data));
    }

    /**
     * Read the template html and replace the href and src path
     */
    getWebViewContent(): string {
        const resourcePath = path.join(this.viewPath, 'index.html');
        const html = fs.readFileSync(resourcePath).toString();
        return html.replace(/(href="\.|src="\.)/g, (m) => {
            return m.substring(0, m.length - 1) + this.panel.webview.asWebviewUri(Uri.file(this.viewPath));
        });
    }

    close(): void {
        this.panel.dispose();
    }
}