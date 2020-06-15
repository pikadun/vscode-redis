import vscode, { ExtensionContext, window } from 'vscode';
import Pty from './pty';
import RedisItem from '../../node/redis';
import Dictionary from '../../common/dictionary';


class Terminal {
    terminals = new Dictionary<vscode.Terminal>();
    constructor(context: ExtensionContext) {
        console.log(context);
    }

    create(element: RedisItem): void {
        const pty = new Pty(element.name, element.socket, () => { this.onClose(element.id); });
        const terminal = window.createTerminal({ name: `Redis-${element.name}`, pty });
        this.terminals.set(element.id, terminal);
    }

    show(element: RedisItem): void {
        if (!this.terminals.has(element.id)) {
            this.create(element);
        }
        const terminal = this.terminals.get(element.id);
        terminal.show();
    }

    /**
     * Terminal is closed by an act of the user.
     * @param id 
     */
    onClose(id: string): void {
        this.terminals.get(id).dispose();
        this.terminals.del(id);
    }
}

export default Terminal;