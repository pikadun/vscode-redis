import { window, ViewColumn, WebviewPanel, Uri, ExtensionContext } from 'vscode';
import { RedisPanel } from '../../abstraction/enum';
import { PanelOptions } from 'src/abstraction/interface';
import fs from 'fs';
import path from 'path';

class Panel {
    private readonly viewType = 'RedisView';
    private readonly title = 'Redis';
    private readonly basePath = this.context.extensionPath;
    private readonly viewPath = path.join(this.basePath, 'lib/view');
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

        panel.iconPath = Uri.file(path.resolve(this.basePath, 'resources', 'image', 'redis.png'));
        panel.onDidDispose(() => {
            this.panelDisPosed = true;
        });
        this.panelDisPosed = false;
        this.panel = panel;
    }
    /**
     * Show a redis panel
     * @param name panel name
     */
    show(name: RedisPanel, options?: PanelOptions): void {
        if (this.panelDisPosed) {
            this.create();
        }

        this.panel.reveal(ViewColumn.One);
        const html = this.getWebViewContent('index.html');
        this.panel.webview.html = html;

        const common = { fromVscode: true, name };

        switch (name) {
            case RedisPanel.KEY_INFO:
                this.panel.webview.postMessage(Object.assign(options?.redisData, common));
                break;
            case RedisPanel.ADD_CONNECTION:
                this.panel.webview.postMessage(common);
                break;
            default:
                this.panel.webview.postMessage(common);
        }
    }

    getWebViewContent(templateName: string): string {
        const resourcePath = path.join(this.viewPath, templateName);
        let html = fs.readFileSync(resourcePath).toString();
        html = html.replace(/(href=\.|src=\.)/g, (m) => {
            return m.substring(0, m.length - 1) + Uri.file(this.viewPath).with({ scheme: 'vscode-resource' });
        });

        return html;
    }
}

export default Panel;