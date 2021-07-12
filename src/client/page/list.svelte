<script lang="ts">
    import Header from "./component/header.svelte";
    import Table from "../component/table.svelte";
    import Button from "../component/button.svelte";
    import Input from "../component/input.svelte";
    import Select from "../component/select.svelte";

    export let key = "";
    export let value: string[] = [];
    export let id = "";
    export let ttl = "";

    $: valueUpdated(value);
    const valueUpdated = (values: string[]) => {
        if (sort === "Positive") {
            rows = values.map((v, index) => ({ index, value: v }));
        } else {
            rows = [...values]
                .reverse()
                .map((v, index) => ({ index, value: v }));
        }
    };

    let sort: "Positive" | "Reverse" = "Positive";
    $: sortUpdated(sort);
    const sortUpdated = (_sort: string) => {
        valueUpdated(value);
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
        const positiveIndex =
            sort === "Positive"
                ? selected["index"]
                : value.length - selected["index"] - 1;

        window.vscode.postMessage({
            self: true,
            command: "Redis.Key.Operation",
            args: [id, "lrem", positiveIndex],
        });
    };
</script>

<div class="list">
    <Header {id} {key} {ttl} type="list" />
    <div class="datas">
        <Table {rows} {columns} bind:selected />
        <div class="operation">
            <Button on:click={deleteValue} disabled={selected === undefined}
                >Delete Value</Button
            >
            <Select options={["Positive", "Reverse"]} bind:selected={sort} />
        </div>
    </div>
    <b style="display: block;">Value:</b>
    <Input type="textarea" readonly value={selected?.["value"] || ""} />
</div>

<style>
    .list {
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
