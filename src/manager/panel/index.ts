import { window, ViewColumn, WebviewPanel, Uri, ExtensionContext } from 'vscode';
import { RedisPanel } from '../../abstraction/enum';
import { PanelOptions } from 'src/abstraction/interface';
import fs from 'fs';
import path from 'path';

class Panel {
    private readonly viewType = 'RedisView';
    private readonly title = 'Redis';
    private readonly basePath = path.join(this.context.extensionPath, 'lib/view');
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

        panel.onDidDispose(() => {
            this.panelDisPosed = true;
        });
        this.panelDisPosed = false;
        this.panel = panel;
    }
    /**
     * Show a redis panel
     * @param name 
     */
    show(name: RedisPanel, options: PanelOptions): void {
        if (this.panelDisPosed) {
            this.create();
        }

        let html = '';
        switch (name) {
            case RedisPanel.KEY_INFO:
                html = this.getWebViewContent('key.html');
                break;
        }

        this.panel.webview.html = html;
        this.panel.webview.postMessage(options.redisData);
    }

    getWebViewContent(templateName: string): string {
        const resourcePath = path.join(this.basePath, templateName);
        let html = fs.readFileSync(resourcePath).toString();
        html = html.replace(/(href=\.|src=\.)/g, (m) => {
            return m.substring(0, m.length - 1) + Uri.file(this.basePath).with({ scheme: 'vscode-resource' });
        });

        return html;
    }
}

export default Panel;