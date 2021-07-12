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
        rows = values
            .map((_e, i) => {
                if (i % 2 === 0) {
                    return { value: value[i], score: value[i + 1] };
                } else {
                    return undefined;
                }
            })
            .filter((e) => e !== undefined);
    };

    let rows: any[];
    let selected: any;
    const columns = [
        {
            key: "value",
            title: "Value",
        },
        {
            key: "score",
            title: "Score",
        },
    ];

    const deleteField = () => {
        window.vscode.postMessage({
            self: true,
            command: "Redis.Key.Operation",
            args: [id, "zrem", selected["value"]],
        });
    };
</script>

<div class="zset">
    <Header {id} {key} {ttl} type="zset" />
    <div class="datas">
        <Table {rows} {columns} bind:selected />
        <div class="operation">
            <Button on:click={deleteField} disabled={selected === undefined}
                >Delete Value</Button
            >
        </div>
    </div>

    <b style="display: block;">Score:</b>
    <Input type="number" readonly value={selected?.["score"] || ""} />
    <b style="display: block;">Value:</b>
    <Input type="textarea" readonly value={selected?.["value"] || ""} />
</div>

<style>
    .zset {
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
