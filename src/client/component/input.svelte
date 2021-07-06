<script lang="ts">
    import { onMount } from "svelte";
    export let id = "";
    export let type: string = "text";
    export let placeholder = "";
    export let value: string | number | undefined = undefined;
    export let readonly: boolean | undefined = undefined;

    let element: HTMLInputElement;
    onMount(() => {
        element.type = type;
    });
</script>

<div class="r-input">
    <slot name="prepend" />
    <input {id} {placeholder} {readonly} bind:value bind:this={element} />
</div>

<style>
    .r-input {
        display: inline-block;
        margin: 10px 0;
    }
</style>
