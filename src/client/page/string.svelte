<script lang="ts">
    import Header from "./component/header.svelte";
    import Input from "../component/input.svelte";

    export let key = "";
    export let value = "";
    export let id = "";
    export let ttl = "";
</script>

<div class="string">
    <Header {id} {key} {ttl} type="string" />
    <Input type="textarea" {value} readonly />
</div>

<style>
    .string {
        display: grid;
        grid-template-rows: auto 1fr;
        height: 100%;
    }
</style>
