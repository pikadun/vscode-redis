<script lang="ts">
    export let columns: any[];
    export let rows: any[];
    export let index = true;
    export let selected: any = {};

    let hoverRow = -1;
    let seletedRow = -1;

    $: rowsUpdated(rows);

    const rowsUpdated = (_rows: any[]) => {
        seletedRow = -1;
        hoverRow = -1;
        selected = undefined;
    };

    const handleRowClick = (n: number) => {
        seletedRow = n;
        selected = rows[n];
    };
</script>

<table class="r-table">
    <thead style="width: calc(100% - 0.4rem)">
        <tr>
            {#if index}
                <th style="width: 3rem;">Index</th>
            {/if}
            {#each columns as col}
                <th>{col.title}</th>
            {/each}
        </tr>
    </thead>
    <tbody style="max-height: 5rem;">
        {#each rows as row, n}
            <tr
                class:r-table-selected={seletedRow === n}
                on:click={() => {
                    handleRowClick(n);
                }}
            >
                {#if index}
                    <td style="width: 3rem;">{n}</td>
                {/if}
                {#each columns as col}
                    <td>{row[col.key]}</td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>

<style>
    .r-table {
        border-collapse: collapse;
        width: 100%;
        table-layout: fixed;
        text-align: center;
    }

    .r-table th {
        position: sticky;
        top: 0;
    }

    .r-table tbody {
        display: block;
        overflow-y: scroll;
    }

    .r-table thead,
    .r-table tbody tr {
        display: table;
        width: 100%;
        table-layout: fixed;
    }

    .r-table td {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .r-table tbody tr:hover {
        background-color: var(--vscode-list-hoverBackground);
    }

    .r-table tbody tr:active,
    .r-table-selected {
        background-color: var(--vscode-list-activeSelectionBackground);
        color: var(--vscode-list-activeSelectionForeground);
    }
</style>
