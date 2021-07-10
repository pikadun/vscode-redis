<script>
    export let disabled = false;
</script>

<button class="r-button" on:click {disabled}>
    <slot />
</button>

<style>
    .r-button {
        cursor: pointer;
        margin: 5px 2px;
        outline: none;
    }

    .r-button:hover {
        background: var(--vscode-button-hoverBackground);
    }

    .r-button:active {
        opacity: 0.8;
    }
</style>
