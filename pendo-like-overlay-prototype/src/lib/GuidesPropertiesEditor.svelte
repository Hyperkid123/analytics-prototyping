<script>
  import { onMount } from 'svelte'
  import { selectedElement } from '../stores/selectedElement'
  import interact from 'interactjs'
  import PropertiesTabs from './PropertiesTabs/PropertiesTabs.svelte'

  let overlayElement
  let dragHandleElement
  const position = { x: 0, y: 0 }

  onMount(() => {
    if ($selectedElement && overlayElement && dragHandleElement) {
      const { x, bottom } = $selectedElement.getBoundingClientRect()
      position.x = x + 16
      position.y = bottom + 16
      overlayElement.style.transform = `translate(${position.x}px, ${position.y}px)`
      interact(overlayElement)
        .allowFrom(dragHandleElement)
        .draggable({
          listeners: {
            move(event) {
              position.x += event.dx
              position.y += event.dy

              event.target.style.transform = `translate(${position.x}px, ${position.y}px)`
            },
          },
        })
    }
  })
</script>

<div
  bind:this={overlayElement}
  id="guide-overlay-main-container"
  class="overlay"
>
  <div bind:this={dragHandleElement} class="drag-handle">
    <span class="drag-handle-icon" />
    Edit properties
  </div>
  <div class="editor-body">
    <PropertiesTabs />
  </div>
</div>

<style>
  .drag-handle {
    padding: 0.5em;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background: #212121;
    color: white;
    display: flex;
    align-items: baseline;
  }
  .drag-handle-icon {
    display: inline-block;
    width: 1.2em;
    height: 0.8em;
    margin-right: 0.8em;
  }

  .drag-handle-icon,
  .drag-handle-icon::before {
    background-image: radial-gradient(white 40%, transparent 40%);
    background-size: 6px 6px;
    background-position: 0 100%;
    background-repeat: repeat-x;
  }
  .drag-handle-icon::before {
    content: '';
    display: block;
    width: 100%;
    height: 50%;
  }
  .overlay {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    position: fixed;
    width: 300px;
    height: 300px;
    top: 0;
    background: white;
  }
</style>
