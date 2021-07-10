<script>
    export let disabled = false;
</script>

<div class="r-button">
    <button on:click {disabled}>
        <slot />
    </button>
</div>

<style>
    .r-button {
        display: inline-block;
        margin: 5px 2px;
    }
</style>
