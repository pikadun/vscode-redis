<script lang="ts">
    import { onMount } from "svelte";
    export let id = "";
    export let type: string = "text";
    export let placeholder = "";
    export let value: string | number | undefined = undefined;
    export let readonly: boolean | undefined = undefined;
    export let width = "";

    let element: HTMLInputElement;
    onMount(() => {
        element.type = type;
    });
</script>

<div class="r-input">
    <slot name="prepend" />
    <input
        style="width:{width}"
        {id}
        {placeholder}
        {readonly}
        bind:value
        bind:this={element}
        on:blur
        on:click
        on:focus
        on:keyup
    />
    <slot name="append" />
</div>

<style>
    .r-input {
        position: relative;
        display: inline-block;
        margin: 5px 2px;
    }
</style>
