import vscode, { ExtensionContext, window } from 'vscode';
import Constant from '../common/constant';
import RedisItem from '../tree/redis';
import Pty from './pty';

export default class Terminal {
    private terminals = new Map<string, vscode.Terminal>();
    constructor(
        readonly context: ExtensionContext
    ) { }

    create(redis: RedisItem): void {
        const timestamp = this.context.globalState.get<number>(Constant.GLOBAL_STATE_WELCOME_KEY) || Date.now();
        const pty = new Pty(redis, timestamp < Date.now(), () => this.close(redis.id));
        const name = `Redis-${redis.config.name}`;
        const terminal = window.createTerminal({ name, pty });
        this.context.globalState.update(
            Constant.GLOBAL_STATE_WELCOME_KEY,
            new Date(new Date().toDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
        );
        this.terminals.set(redis.id, terminal);
    }

    show(redis: RedisItem): void {
        redis.connect();
        if (!this.terminals.has(redis.id)) {
            this.create(redis);
        }
        this.terminals.get(redis.id)?.show();
    }

    /**
     * Terminal is closed by an act of the user.
     * @param id 
     */
    private close(id: string): void {
        this.terminals.get(id)?.dispose();
        this.terminals.delete(id);
    }
}