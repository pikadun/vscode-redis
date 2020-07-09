import { TreeDataProvider, EventEmitter, ExtensionContext, TreeItemCollapsibleState, window } from 'vscode';

import { RedisPanel } from 'src/abstraction/enum';
import { PanelOptions, ConnectionOptions } from 'src/abstraction/interface';

import RedisItem from 'src/node/redis';
import Panel from '../panel';
import Config from './config';
import Element from './element';

class Connection implements TreeDataProvider<Element> {
    _onDidChangeTreeData = new EventEmitter<Element | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    private config = new Config(this.context);

    constructor(private context: ExtensionContext) { }
    getTreeItem(element: Element): Element {
        element.refresh = (e) => { this.refresh(e); };
        return element;
    }

    async getChildren(element?: Element): Promise<Element[]> {
        if (element) {
            return element.getChildren();
        }

        // Return [RedisItem](#RedisItem) if element not passed.
        return Object.entries(this.config.all())
            .map(([id, config]) => new RedisItem(id, config, TreeItemCollapsibleState.Collapsed));
    }

    /**
     * Add or edit a connection
     * @param id Connection Id.
     * @param config The connection config.
     */
    async add([id, config]: ConnectionOptions): Promise<void> {
        try {
            id = id || Date.now().toString();
            this.config.set(id, config);
            this.refresh();
        } catch (error) {
            window.showErrorMessage(error.message);
        }
    }

    /**
     * Add or edit a connection
     * @param panel Panel instance
     * @param id Connection id
     */
    edit(panel: Panel, id?: string): void {
        const options: PanelOptions = {};
        if (id) {
            options.connection = this.config.get(id);
        }
        panel.show(RedisPanel.CONNECTION, options);
    }

    delete(element: RedisItem): void {
        this.config.delete(element.id);
        this.refresh();
    }

    refresh(element?: Element): void {
        this._onDidChangeTreeData.fire(element);
    }
}

export default Connection;