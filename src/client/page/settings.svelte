<script lang="ts">
    import Input from "../component/input.svelte";
    import Button from "../component/button.svelte";

    export let id: string;
    export let host: string;
    export let port: number;
    export let password: string;
    export let name: string;

    $: options = { host, port, password, name };

    const testConnection = () => {
        window.vscode.postMessage({
            self: true,
            command: "Redis.Connection.Test",
            args: [options],
        });
    };

    const addConnection = () => {
        window.vscode.postMessage({
            self: true,
            command: "Redis.Connection.Add",
            args: [id, options],
        });
    };
</script>

<div class="settings">
    <span class="title">IP address of the Redis server:</span>
    <Input placeholder="(optional) host" bind:value={host} />
    <span class="title">Port of the Redis server:</span>
    <Input type="number" placeholder="(optional) port" bind:value={port} />
    <span class="title">Authentication password:</span>
    <Input
        type="password"
        placeholder="(optional) auth"
        bind:value={password}
    />
    <span class="title">Connection name:</span>
    <Input placeholder="(optional) name" bind:value={name} />
    <div>
        <Button on:click={testConnection}>Test Connection</Button>
        <Button on:click={addConnection}>OK</Button>
    </div>
</div>

<style>
    .title {
        display: block;
        margin-top: 10px;
    }
</style>
