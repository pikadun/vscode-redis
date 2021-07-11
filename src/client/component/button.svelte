<script>
    export let disabled = false;
</script>

<div class="r-button">
    <button class="r-button__button" on:click {disabled}>
        <slot />
    </button>
</div>

<style>
    .r-button {
        display: inline-block;
        margin: 5px 2px;
    }

    .r-button__button {
        color: var(--vscode-button-foreground);
        background: var(--vscode-button-background);
        border: none;
        cursor: pointer;
        padding: 2px 4px;
    }

    .r-button__button:hover {
        background: var(--vscode-button-hoverBackground);
    }

    .r-button__button:focus {
        outline: 1px solid var(--vscode-inputOption-activeBorder);
        outline-offset: 2px;
    }

    .r-button__button:disabled {
        cursor: not-allowed;
    }
</style>
