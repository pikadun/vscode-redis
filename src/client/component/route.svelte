<script lang="ts">
    import { SvelteComponentTyped } from "svelte";
    export let component: SvelteComponentTyped | boolean = false;
    export let params = {};
</script>

<svelte:component this={component} {...params} />
