import { TreeItem } from 'vscode';

abstract class Element extends TreeItem {
    abstract getChildren(): Promise<Element[]>;
    refresh!: (e: Element) => void;
}

export default Element;