import AbstractNode from "./abstraction";
import { TreeItemCollapsibleState } from "vscode";
import { TreeItemContextValue } from "../abstraction/constant";
import path from "path";

export class KeyItem extends AbstractNode {
    contextValue = TreeItemContextValue.KEY;
    iconPath = path.join(__dirname, '..', '..', 'resources', `${this.contextValue}.png`);
    constructor(
        readonly label: string,
        readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }

    /**
     * @todo Split the key by ':' and group them
     */
    getChildren(): Promise<AbstractNode[]> {
        throw new Error("Method not implemented.");
    }
}