<script lang="ts">
    import Header from "./component/header.svelte";
    import Select from "../component/select.svelte";
    import Button from "../component/button.svelte";

    export let key = "";
    export let value: string[] = [];
    export let id = "";
    export let ttl = "";

    let oldValue = value;
    let selected: any = { field: value[0], value: value[1] };

    $: if (oldValue.toString() !== value.toString()) {
        selected = { field: value[0], value: value[1] };
        oldValue = value;
    }

    $: datas = value
        .map((_e, i) => {
            if (i % 2 === 0) {
                return { field: value[i], value: value[i + 1] };
            } else {
                return undefined;
            }
        })
        .filter((e) => e !== undefined) as any[];

    const deleteField = () => {
        window.vscode.postMessage({
            self: true,
            command: "Redis.Key.Operation",
            args: [id, "hdel", selected["field"]],
        });
    };
</script>

<div class="hash">
    <Header {id} {key} {ttl} type="hash" />
    <div class="sub-header">
        <Select filterable bind:selected options={datas} labelField="field">
            <span slot="prepend">Field:</span>
            <span slot="option" let:option>{option["field"]}</span>
        </Select>
        <Button on:click={deleteField}>Delete Field</Button>
    </div>
    <textarea class="value" readonly>{selected["value"]}</textarea>
</div>

<style>
    .hash {
        display: grid;
        grid-template-rows: auto auto 1fr;
        height: 100%;
    }
    .sub-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .value {
        padding: 0.5vw;
        width: 100%;
        overflow: scroll;
        resize: none;
    }
</style>
