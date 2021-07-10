<script lang="ts">
    export let columns: any[];
    export let rows: any[];
    export let index = true;
    export let selected: any = {};

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
</script>

<table class="r-table">
    <thead>
        <tr>
            {#if index}
                <th class="r-table-index">Index</th>
            {/if}
            {#each columns as col}
                <th>{col.title}</th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each rows as row, n}
            <tr
                class:r-table-selected={seletedRow === n}
                on:click={() => {
                    handleRowClick(n);
                }}
            >
                {#if index}
                    <td class="r-table-index">{n}</td>
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
        max-height: 10rem;
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
    .r-table tbody tr:active,
    .r-table-selected {
        background-color: var(--vscode-list-activeSelectionBackground);
        color: var(--vscode-list-activeSelectionForeground);
    }
</style>
