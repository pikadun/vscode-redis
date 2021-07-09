<script lang="ts">
    import Header from "./component/header.svelte";

    export let key = "";
    export let value = "";
    export let id = "";
    export let ttl = "";
</script>

<div class="string">
    <Header {id} {key} {ttl} type="string" />
    <textarea class="value" readonly>{value}</textarea>
</div>

<style>
    .string {
        display: grid;
        grid-template-rows: auto 1fr;
        height: 100%;
    }
    .value {
        padding: 0.5vw;
        width: 100%;
        overflow: scroll;
        resize: none;
    }
</style>
