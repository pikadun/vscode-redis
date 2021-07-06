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
    <Input id="host" placeholder="(optional) host" bind:value={host}>
        <div slot="prepend" class="prepend">
            IP address of the Redis server:
        </div>
    </Input>
    <Input
        id="port"
        type="number"
        placeholder="(optional) port"
        bind:value={port}
    >
        <div slot="prepend" class="prepend">Port of the Redis server:</div>
    </Input>
    <Input
        id="password"
        type="password"
        placeholder="(optional) auth"
        bind:value={password}
    >
        <div slot="prepend" class="prepend">Authentication password:</div>
    </Input>
    <Input id="name" placeholder="(optional) name" bind:value={name}>
        <div slot="prepend" class="prepend">Connection name:</div>
    </Input>
    <div>
        <Button on:click={testConnection}>Test Connection</Button>
        <Button on:click={addConnection}>OK</Button>
    </div>
</div>

<style>
    .settings {
        display: flex;
        flex-direction: column;
    }
</style>
