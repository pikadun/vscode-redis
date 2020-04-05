import { TreeItem } from "vscode";

abstract class AbstractNode extends TreeItem {
    abstract getChildren(): Promise<AbstractNode[]>;
}

export default AbstractNode