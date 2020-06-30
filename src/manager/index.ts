import { ExtensionContext } from 'vscode';
import ConnectionProvider from './connection';
import Terminal from './terminal';
import Panel from './panel';

class Manager {
    ConnectionProvider: ConnectionProvider;
    Terminal: Terminal;
    Panel: Panel;
    constructor(context: ExtensionContext) {
        this.ConnectionProvider = new ConnectionProvider(context);
        this.Terminal = new Terminal(context);
        this.Panel = new Panel(context);
    }
}

export default Manager;
