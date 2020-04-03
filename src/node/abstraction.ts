import { TreeItem } from "vscode";
import { Socket } from "net";

abstract class AbstractNode extends TreeItem {
    abstract getChildren(socket: Socket): Promise<AbstractNode[]>;
}

export default AbstractNode