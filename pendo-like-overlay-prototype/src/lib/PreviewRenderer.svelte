<script>
  import { onMount } from 'svelte'
  import { guideLayout } from '../stores/guideLayouts'
  import { selectedElement } from '../stores/selectedElement'
  import RenderChildren from './GuideRenderer/RenderChildren.svelte'

  let containerElement
  const position = { x: 0, y: 0 }
  onMount(() => {
    if ($selectedElement) {
      const { x, bottom } = $selectedElement.getBoundingClientRect()
      position.x = x + 16
      position.y = bottom + 16
      containerElement.style.top = `${position.y}px`
      containerElement.style.left = `${position.x}px`
    }
  })
</script>

<div class="container" bind:this={containerElement}>
  {#if $guideLayout}
    <RenderChildren {...$guideLayout} />
  {/if}
</div>

<style>
  .container {
    position: fixed;
    background: white;
  }
</style>
