<script>
  import { onMount } from 'svelte'

  export let passRef
  export let ref
  onMount(() => {
    passRef(ref)
  })
</script>

<span bind:this={ref}>
  <slot />
</span>
