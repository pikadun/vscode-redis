import { EventEmitter, ExtensionContext, TreeDataProvider, window } from 'vscode';
import ConnectionConfigStore, { ConnectionConfig } from './config';
import RedisItem from './redis';
import Element from './element';


export default class Provider implements TreeDataProvider<Element> {

    private configStore: ConnectionConfigStore;
    private treeItemStore: Record<string, Element> = {};
    private changeTreeData = new EventEmitter<Element | void>();
    public onDidChangeTreeData = this.changeTreeData.event;

    constructor(context: ExtensionContext) {
        this.configStore = new ConnectionConfigStore(context);
    }

    getTreeItem(element: Element): Element {
        this.treeItemStore[element.id as string] = element;
        element.refresh = async () => {
            await element.beforeRefresh();
            this.refresh(element);
        };
        return element;
    }

    getTreeItemById(id: string): Element {
        const element = this.treeItemStore[id];
        if (element === undefined) {
            throw Error('No element found');
        }
        return element;
    }

    async getChildren(element?: Element): Promise<Element[]> {
        if (element) {
            return element.getChildren();
        }
        return Object.entries(this.configStore.all())
            .map(([id, config]) => new RedisItem(id, config));
    }

    private refresh(element?: Element): void {
        this.changeTreeData.fire(element);
    }

    add([id, config]: [string, ConnectionConfig]): void {
        id = id || Date.now().toString();
        this.configStore.set(id, config);
        this.refresh();
    }

    async delete(id: string): Promise<void> {
        const res = await window.showInformationMessage(
            'Do you really want to delete connection?',
            'Yes', 'No'
        );
        if (res === 'Yes') {
            this.configStore.delete(id);
            this.refresh();
        }
    }

    async test(config: ConnectionConfig): Promise<void> {
        const connection = new RedisItem('test', config);

        try {
            await connection.test();
            window.showInformationMessage('Connection succeeded!');
        } catch (error) {
            window.showErrorMessage(error + '');
        } finally {
            connection.dispose();
        }
    }
}