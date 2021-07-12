<script lang="ts">
    import Header from "./component/header.svelte";
    import Table from "../component/table.svelte";
    import Button from "../component/button.svelte";
    import Input from "../component/input.svelte";

    export let key = "";
    export let value: [string, string[]][] = [];
    export let id = "";
    export let ttl = "";

    $: valueUpdated(value);

    const valueUpdated = (values: [string, string[]][]) => {
        rows = values.map((v: [string, string[]]) => {
            const id = v[0];
            const value: { [x: string]: string } = {};

            for (let i = 0; i < v[1].length; ) {
                value[v[1][i++] as string] = v[1][i++] as string;
            }

            return { id, value: JSON.stringify(value) };
        });
    };

    let rows: any[];
    let selected: any;
    const columns = [
        {
            key: "id",
            title: "ID",
        },
        {
            key: "value",
            title: "Value",
        },
    ];

    const deleteValue = () => {
        window.vscode.postMessage({
            self: true,
            command: "Redis.Key.Operation",
            args: [id, "xdel", selected["id"]],
        });
    };
</script>

<div class="stream">
    <Header {id} {key} {ttl} type="stream" />
    <div class="datas">
        <Table {rows} {columns} bind:selected />
        <div class="operation">
            <Button on:click={deleteValue} disabled={selected === undefined}
                >Delete Value</Button
            >
        </div>
    </div>

    <b style="display: block;">ID</b>
    <Input type="textarea" readonly value={selected?.["id"] || ""} />
    <b style="display: block;">Value (represented as JSON object)</b>
    <Input type="textarea" readonly value={selected?.["value"] || ""} />
</div>

<style>
    .stream {
        display: grid;
        grid-template-rows: repeat(5, auto) 1fr;
        height: 100%;
    }
    .datas {
        display: grid;
        grid-template-columns: 1fr auto;
        margin: 5px 0;
    }
</style>
