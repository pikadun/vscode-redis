import vscode, { ExtensionContext, window } from 'vscode';
import Pty from './pty';
import RedisItem from 'src/node/redis';
import Dictionary from 'src/common/dictionary';
import { Constant } from 'src/abstraction/enum';


class Terminal {
    terminals = new Dictionary<vscode.Terminal>();
    constructor(
        private context: ExtensionContext
    ) { }

    create(redisItem: RedisItem): void {
        const timestamp = this.context.globalState.get<number>(Constant.GLOBAL_STATE_WELCOME_KEY) || Date.now();
        const pty = new Pty(redisItem, timestamp < Date.now(), () => { this.onClose(redisItem.id); });
        const terminal = window.createTerminal({ name: `Redis-${redisItem.config.name}`, pty });

        this.context.globalState.update(
            Constant.GLOBAL_STATE_WELCOME_KEY,
            new Date(new Date().toDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
        );
        this.terminals.set(redisItem.id, terminal);
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