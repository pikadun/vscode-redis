<script lang="ts">
    import Header from "./component/header.svelte";
    import Table from "../component/table.svelte";
    import Button from "../component/button.svelte";
    import Input from "../component/input.svelte";

    export let key = "";
    export let value: string[] = [];
    export let id = "";
    export let ttl = "";

    $: valueUpdated(value);
    const valueUpdated = (values: string[]) => {
        rows = values.map((v) => ({ value: v }));
    };

    let rows: any[];
    let selected: any;
    const columns = [
        {
            key: "value",
            title: "Value",
        },
    ];

    const deleteValue = () => {
        window.vscode.postMessage({
            self: true,
            command: "Redis.Key.Operation",
            args: [id, "srem", selected["value"]],
        });
    };
</script>

<div class="set">
    <Header {id} {key} {ttl} type="set" />
    <div class="datas">
        <Table {rows} {columns} bind:selected />
        <div class="operation">
            <Button on:click={deleteValue} disabled={selected === undefined}
                >Delete Value</Button
            >
        </div>
    </div>
    <b style="display: block;">Value</b>
    <Input type="textarea" readonly value={selected?.["value"] || ""} />
</div>

<style>
    .set {
        display: grid;
        grid-template-rows: repeat(3, auto) 1fr;
        height: 100%;
    }

    .datas {
        display: grid;
        grid-template-columns: 1fr auto;
        margin: 5px 0;
    }

    .operation {
        display: flex;
        flex-direction: column;
        width: max-content;
        max-width: 12rem;
    }
</style>
