/* eslint-disable @typescript-eslint/no-empty-function */
import { TreeItem } from 'vscode';

export default abstract class Element extends TreeItem {
    abstract getChildren(): Promise<Element[]>;
    async beforeRefresh(): Promise<void> { }
    refresh!: () => void;
}