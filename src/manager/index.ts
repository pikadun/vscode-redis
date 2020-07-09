import { ExtensionContext } from 'vscode';
import Connection from './connection';
import Terminal from './terminal';
import Panel from './panel';

class Manager {
    Connection: Connection;
    Terminal: Terminal;
    Panel: Panel;
    constructor(context: ExtensionContext) {
        this.Connection = new Connection(context);
        this.Terminal = new Terminal(context);
        this.Panel = new Panel(context);
    }
}

export default Manager;
