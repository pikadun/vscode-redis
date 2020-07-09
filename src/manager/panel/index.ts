import { window, ViewColumn, WebviewPanel, Uri, ExtensionContext, commands } from 'vscode';
import { RedisPanel } from 'src/abstraction/enum';
import { PanelOptions } from 'src/abstraction/interface';
import fs from 'fs';
import path from 'path';

class Panel {
    private readonly viewType = 'RedisView';
    private readonly title = 'Redis';
    private readonly basePath = this.context.extensionPath;
    private readonly viewPath = path.join(this.basePath, 'out/view');
    private panel!: WebviewPanel;
    private panelDisPosed = true;
    constructor(private context: ExtensionContext) { }

    private create(): void {
        const panel = window.createWebviewPanel(
            this.viewType,
            this.title,
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
            if (!message.fromWebview) {
                return;
            }
            commands.executeCommand(message.command, ...message.args);
        });

        this.panelDisPosed = false;
        this.panel = panel;
    }
    /**
     * Show a redis panel
     * @param panelName panel name
     */
    show(panelName: RedisPanel, options?: PanelOptions): void {
        if (this.panelDisPosed) {
            this.create();
        }

        this.panel.reveal(ViewColumn.One);
        const html = this.getWebViewContent('index.html');
        this.panel.webview.html = html;

        const common = { fromVscode: true, panelName };

        let data = Object.create(null);
        switch (panelName) {
            case RedisPanel.KEY_INFO:
                data = Object.assign(common, options?.data);
                break;
            case RedisPanel.CONNECTION:
                data = Object.assign(common, options?.connection);
                break;
            default:
                data = common;
        }
        this.panel.webview.postMessage(data);
    }

    /**
     * Read the template html and replace the href and src path
     * @param templateName template html name
     */
    getWebViewContent(templateName: string): string {
        const resourcePath = path.join(this.viewPath, templateName);
        const html = fs.readFileSync(resourcePath).toString();
        return html.replace(/(href=\.|src=\.)/g, (m) => {
            return m.substring(0, m.length - 1) + this.panel.webview.asWebviewUri(Uri.file(this.viewPath));
        });
    }
}

export default Panel;