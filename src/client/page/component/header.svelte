<script lang="ts">
    import Input from "../../component/input.svelte";
    import Button from "../../component/button.svelte";

    export let type = "";
    export let key = "";
    export let id = "";
    export let ttl = "";

    const rename = () => {
        window.vscode.postMessage({
            self: true,
            command: "Redis.Key.Operation",
            args: [id, "rename"],
        });
    };

    const expire = () => {
        window.vscode.postMessage({
            self: true,
            command: "Redis.Key.Operation",
            args: [id, "expire", ttl],
        });
    };

    const reload = () => {
        window.vscode.postMessage({
            self: true,
            command: "Redis.Key.Operation",
            args: [id, "detail"],
        });
    };

    const del = () => {
        window.vscode.postMessage({
            self: true,
            command: "Redis.Key.Operation",
            args: [id, "del"],
        });
    };
</script>

<div class="header">
    <b>{type}:</b>
    <span><Input {id} bind:value={key} readonly /></span>
    <Button on:click={rename}>Rename</Button>
    <Button on:click={expire}>TTL:{ttl}</Button>
    <Button on:click={reload}>Reload</Button>
    <Button on:click={del}>Delete</Button>
</div>

<style>
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .header > span {
        flex-grow: 1;
    }
</style>
