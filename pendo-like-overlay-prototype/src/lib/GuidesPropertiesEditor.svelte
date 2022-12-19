<script>
  import { onDestroy, onMount } from "svelte";
  import { selectedElement } from "../stores/selectedElement";
  import interact from 'interactjs'

  let overlayElement
  const position = { x: 0, y: 0 }

  onMount(() => {
    if($selectedElement && overlayElement) {
      console.log(selectedElement, overlayElement)
      interact(overlayElement).draggable({
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
  <div draggable="false">
    <h1>There will be dragons</h1>
  </div>
</div>

<style>
  .overlay {
    background-color: azure;
    position: fixed;
    width: 300px;
    height: 300px;
    top: 0
  }
</style>