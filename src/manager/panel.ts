import { window, ViewColumn, WebviewPanel } from "vscode";
import Collection from "./collection";

class Panel {
    private readonly viewType = "RedisView";
    private readonly title = "Redis";
    private panels = new Collection<WebviewPanel>()

    /**
     * Create a panel to show some value
     */
    private create(): WebviewPanel {
        const panel = window.createWebviewPanel(
            this.viewType,
            this.title,
            ViewColumn.One,
            {}
        );
        return panel
    }

    /**
     * Show a panel
     * @param name 
     */
    show(name: string, html: string): void {
        if (!this.panels.has(name)) {
            this.panels.set(name, this.create())
        }
        const panel = this.panels.get(name)
        panel.webview.html = html
    }
}

export default Panel