<script lang="ts">
    import Header from "./component/header.svelte";

    export let key = "";
    export let value = "";
    export let id = "";
    export let ttl = "";
</script>

<div>
    <Header {id} {key} {ttl} type="String" />
    <textarea class="value" readonly>{value}</textarea>
</div>

<style>
    .value {
        padding: 0.5vw;
        width: 100%;
        height: 80vh;
        overflow: scroll;
        resize: none;
        box-sizing: border-box;
    }
</style>
