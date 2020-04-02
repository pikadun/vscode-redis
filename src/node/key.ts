import AbstractNode from "./abstraction";
import { TreeItemContextValue } from "../abstraction/constant";
import path from "path";
import { TreeItemCollapsibleState } from "vscode";

export class KeyItem extends AbstractNode {
    contextValue = TreeItemContextValue.KEY;
    iconPath = path.join(__dirname, '..', 'resources', `${this.contextValue}.png`);
    constructor(
        readonly id: string,
        readonly label: string,
        readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }

    getChildren(): Promise<AbstractNode[]> {
        throw new Error("Method not implemented.");
    }
}