<script>
  import { onDestroy, onMount } from 'svelte'
  import { guideLayout } from '../stores/guideLayouts'
  import { selectedElement } from '../stores/selectedElement'
  import getGuidePosition from './GuideRenderer/getGuidePosition'
  import RenderChildren from './GuideRenderer/RenderChildren.svelte'

  let containerElement
  const position = { x: 0, y: 0 }

  function updatePosition(newPosition) {
    if (containerElement) {
      position.x = newPosition.x
      position.y = newPosition.y
      containerElement.style.top = `${position.y}px`
      containerElement.style.left = `${position.x}px`
    }
  }
  onMount(() => {
    if ($selectedElement) {
      const newPosition = getGuidePosition(
        $selectedElement,
        containerElement,
        $guideLayout.rootPosition
      )
      updatePosition(newPosition)
    }
  })

  const unsubGuideLayout = guideLayout.subscribe(() => {
    if ($selectedElement && containerElement) {
      updatePosition(
        getGuidePosition(
          $selectedElement,
          containerElement,
          $guideLayout.rootPosition
        )
      )
    }
  })

  onDestroy(() => {
    unsubGuideLayout()
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
