import { window, ViewColumn } from "vscode";
import fs from 'fs';
import path from "path";
import KeyItem from "../node/key";

class Panel {
    private readonly viewType = 'RedisView';
    private readonly title = 'Redis';
    private readonly templatePath = path.join(__dirname, '..', '..', 'resources', 'template', `index.html`);
    constructor() { }

    /**
     * Create a panel to show some value
     * @param value Value to show
     */
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

    /**
     * Create a panel to show the value of key
     * @param element The keyitem
     */
    async show(element: KeyItem) {
        const detail = await element.detail()
        this.create(detail)
    }
}

export default Panel