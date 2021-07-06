export { };

interface vscode {
    postMessage(message: { self: true, command: string, args: unknown[] }): Thenable
}

declare global {
    interface Window {
        vscode: vscode
    }
    interface ImportMeta {
        env: {
            MODE: string;
            NODE_ENV: string;
            SSR: string;
        };
    }
    function acquireVsCodeApi(): vscode;
}