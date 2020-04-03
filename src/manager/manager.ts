import { ExtensionContext } from "vscode";
import Connection from "./connection";
import Terminal from "./terminal";

class Manager {
    Connection: Connection;
    Terminal: Terminal;
    constructor(context: ExtensionContext) {
        this.Connection = new Connection(context)
        this.Terminal = new Terminal(context);
    }
}

export default Manager
