<script>
  import { onDestroy, onMount } from "svelte";
  import { selectedElement } from "../stores/selectedElement";
  import interact from 'interactjs'

  let overlayElement
  let dragHandleElement
  const position = { x: 0, y: 0 }

  onMount(() => {
    if($selectedElement && overlayElement && dragHandleElement) {
      interact(overlayElement)
      .allowFrom(dragHandleElement)
      .draggable({
        listeners: {
          move (event) {
            position.x += event.dx
            position.y += event.dy
  
            event.target.style.transform =
              `translate(${position.x}px, ${position.y}px)`
          },
        }
      })
    }
  })
</script>


<div bind:this={overlayElement} id="guide-overlay-main-container" class="overlay">
  <div bind:this={dragHandleElement} class="drag-handle">
    This is drag handle
  </div>
  <div draggable="false">
    <h1>There will be dragons</h1>
  </div>
</div>

<style>
  .drag-handle {
    background: red;
    padding: 8px;
  }
  .overlay {
    background-color: azure;
    position: fixed;
    width: 300px;
    height: 300px;
    top: 0
  }
</style>