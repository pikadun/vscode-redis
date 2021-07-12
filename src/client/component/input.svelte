<script lang="ts">
    import { onMount } from "svelte";
    export let type: "text" | "number" | "password" | "textarea" = "text";
    export let placeholder = "";
    export let value: string | number = "";
    export let readonly = false;

    let element: HTMLInputElement;
    onMount(() => {
        if (element) {
            element.type = type;
        }
    });
</script>

<div class="r-input" class:r-input-light={window.color === 'vscode-light'}>
    {#if type === "textarea"}
        <textarea
            class="r-input__textarea"
            {placeholder}
            {readonly}
            bind:value
            on:click
            on:blur
        />
    {:else}
        <input
            class="r-input__input"
            {placeholder}
            {readonly}
            bind:value
            bind:this={element}
            on:click
            on:blur
        />
    {/if}
</div>

<style>
    .r-input {
        display: inline-block;
        margin: 5px 2px;
    }

    .r-input-light {
        border: 1px solid var(--vscode-settings-textInputBorder);
    }

    .r-input__input,
    .r-input__textarea {
        width: 100%;
        height: 100%;
        background: var(--vscode-input-background);
        color: var(--vscode-input-foreground);
        border: none;
        padding: 2px 4px;
    }

    .r-input__input:focus,
    .r-input__textarea:focus {
        outline: 1px solid var(--vscode-inputOption-activeBorder);
    }

    .r-input__input::placeholder,
    .r-input__textarea::placeholder {
        color: var(--vscode-input-placeholderForeground);
    }

    .r-input__textarea {
        resize: none;
    }
</style>
