<script lang="ts">
    export let columns: any[];
    export let rows: any[];
    export let index = true;
    export let selected: any = {};
    export let maxHeight = "10rem";

    let seletedRow = -1;

    $: rowsUpdated(rows);

    const rowsUpdated = (_rows: any[]) => {
        seletedRow = -1;
        selected = undefined;
    };

    const handleRowClick = (n: number) => {
        seletedRow = n;
        selected = rows[n];
    };

    const borderClass =
        window.color === "vscode-light"
            ? "r-table-border-light"
            : "r-table-border";
</script>

<div class="r-table">
    <table class={borderClass}>
        <thead>
            <tr>
                {#if index}
                    <th class="r-table-index {borderClass}">Index</th>
                {/if}
                {#each columns as col}
                    <th class={borderClass}>{col.title}</th>
                {/each}
            </tr>
        </thead>
        <tbody style="max-height: {maxHeight};">
            {#each rows as row, n}
                <tr
                    class:r-table-selected={seletedRow === n}
                    on:click={() => {
                        handleRowClick(n);
                    }}
                >
                    {#if index}
                        <td class="r-table-index {borderClass}">{n}</td>
                    {/if}
                    {#each columns as col}
                        <td class={borderClass}>{row[col.key]}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .r-table {
        width: 100%;
        table-layout: fixed;
        text-align: center;
    }

    .r-table-index {
        width: 5rem;
    }

    .r-table th {
        position: sticky;
        top: 0;
    }

    .r-table tbody {
        display: block;
        overflow-y: scroll;
    }
    .r-table tbody::-webkit-scrollbar {
        display: none;
    }

    .r-table thead,
    .r-table tbody tr {
        display: table;
        table-layout: fixed;
        width: 100%;
    }

    .r-table td {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .r-table tbody tr:hover {
        background: var(--vscode-list-hoverBackground);
    }

    .r-table tbody tr:active,
    .r-table-selected {
        background-color: var(
            --vscode-list-activeSelectionBackground
        ) !important;
        color: var(--vscode-list-activeSelectionForeground);
    }

    .r-table-border-light {
        border-collapse: collapse;
        border: 1px solid var(--vscode-settings-textInputBorder);
    }

    .r-table-border {
        border-collapse: collapse;
        border: 1px solid var(--vscode-inputOption-activeBorder);
    }
</style>
