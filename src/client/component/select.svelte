<script lang="ts">
    import Input from "./input.svelte";
    export let options: any[];
    export let labelField = "label";
    export let valueField = "value";
    export let selected: any = undefined;

    const handleOptionSelect = (option: any) => {
        selected = option;
        showOptions = false;
    };

    const handleBlur = () => {
        showOptions = false;
    };

    const toggleMenu = () => {
        showOptions = !showOptions;
    };

    let showOptions = false;
</script>

<div class="r-select">
    <Input
        type="text"
        readonly
        value={selected[labelField] || selected}
        on:click={toggleMenu}
        on:blur={handleBlur}
    />
    {#if showOptions}
        <ul class="r-select__options">
            {#each options as option}
                <li
                    class="r-select__option"
                    value={option[valueField] || option}
                    on:mousedown={(e) => e.preventDefault()}
                    on:click={() => {
                        handleOptionSelect(option);
                    }}
                >
                    {option[labelField] || option}
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .r-select {
        position: relative;
        display: inline-block;
    }

    .r-select__options {
        background: var(--vscode-dropdown-listBackground);
        color: var(--vscode-dropdown-foreground);
        border: 1px solid var(--vscode-dropdown-border);
        position: absolute;
        list-style: none;
        padding: 2px 4px;
        margin: 0px 2px;
        cursor: pointer;
        width: calc(100% - 4px);
    }

    .r-select__option:hover {
        background: var(--vscode-list-hoverBackground);
    }

    .r-select__option:active {
        background: var(--vscode-list-activeSelectionBackground);
        color: var(--vscode-list-activeSelectionForeground);
    }
</style>
