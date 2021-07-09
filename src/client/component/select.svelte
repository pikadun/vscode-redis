<script lang="ts">
    import Input from "./input.svelte";

    export let filterable = false;
    export let options: any[];
    export let labelField: string;
    export let selected: any;
    
    let selectedLabel = selected[labelField];
    let showOptions = false;
    let placeholder = selectedLabel;
    let filterOptions = options;

    const toggleMenu = () => {
        showOptions = !showOptions;

        if (filterable && showOptions) {
            placeholder = selectedLabel;
            selectedLabel = "";
        } else {
            selectedLabel = placeholder;
            placeholder = "";
        }
        filterOptions = options;
    };

    const handleSelectOption = (option: Record<string, string>) => {
        selected = option;
        selectedLabel = option[labelField];
        showOptions = false;
        filterOptions = options;
    };

    const search = () => {
        // TODO:
        filterOptions = options.filter(
            (o) => o[labelField].indexOf(selectedLabel) > -1
        );
    };

    const handleBlur = () => {
        showOptions = false;
        selectedLabel = selected[labelField];
        filterOptions = options;
    };
</script>

<div class="r-select">
    <slot name="prepend" />
    <Input
        bind:value={selectedLabel}
        {placeholder}
        readonly={filterable && !showOptions}
        on:blur={handleBlur}
        on:click={toggleMenu}
        on:keyup={search}
    >
        <ul
            class="r-option"
            slot="append"
            style={showOptions
                ? "border-bottom: 1px solid var(--vscode-editor-foreground)"
                : ""}
        >
            {#if showOptions}
                {#each filterOptions as option (option[labelField])}
                    <li
                        class="r-option-item"
                        on:mousedown={(e) => e.preventDefault()}
                        on:click={() => handleSelectOption(option)}
                        title={option[labelField]}
                    >
                        <slot name="option" {option} />
                    </li>
                {/each}
            {/if}
        </ul>
    </Input>
</div>

<style>
    .r-select {
        display: inline-block;
    }
    .r-option {
        z-index: 1;
        position: absolute;
        width: 100%;
        max-height: 150px;
        margin: 0;
        padding: 0;
        background: var(--vscode-editor-background);
        border-left: 1px solid var(--vscode-editor-foreground);
        border-right: 1px solid var(--vscode-editor-foreground);
        overflow-y: scroll;
    }
    .r-option-item {
        list-style: none;
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .r-option-item:hover {
        background: var(--vscode-editor-lineHighlightBackground);
    }
</style>
