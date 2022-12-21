<script>
  import { onMount } from 'svelte'
  export let passRef
  export let ref
  onMount(() => {
    passRef(ref)
  })
</script>

<div bind:this={ref}>
  <slot />
</div>
