import { ExtensionContext } from 'vscode';

class Terminal {
    constructor(context: ExtensionContext) {
        console.log(context);
    }
}

export default Terminal;