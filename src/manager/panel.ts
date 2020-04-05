import { window, ViewColumn } from "vscode";
import fs from 'fs';
import path from "path";
import KeyItem from "../node/key";

class Panel {
    private readonly viewType = 'RedisView';
    private readonly title = 'Redis';
    private readonly templatePath = path.join(__dirname, '..', '..', 'resources', 'template', `index.html`);
    constructor() { }

    create(value: string) {
        const panel = window.createWebviewPanel(
            this.viewType,
            this.title,
            ViewColumn.One,
            {}
        );
        panel.webview.html = this.generate(value)
    }
    private generate(value: string) {
        const template = fs.readFileSync(this.templatePath).toString();
        return template.replace('editorplaceholder', value);
    }

    async show(element: KeyItem) {
        const detail = await element.detail()
        this.create(detail)
    }
}

export default Panel