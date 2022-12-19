<script>
    import { onDestroy } from "svelte";
    import { selectedElement } from "../stores/selectedElement";
    let isEnabled = false
    let hoverIndicator;

    function mouseOverListener(ev) {
      const isValid = !ev.target.closest("[data-guide-control=true]")
      if(!isValid) {
        ev.stopPropagation()
        ev.preventDefault()
        return
      }
      const pos = ev.target.getBoundingClientRect()

      hoverIndicator.style.left = `${pos.x}px`
      hoverIndicator.style.top = `${pos.y}px`
      hoverIndicator.style.width = `${pos.width}px`
      hoverIndicator.style.height = `${pos.height}px`

    }

    function targetClickListener(ev) {
      const isValid = !ev.target.closest("[data-guide-control=true]")
      if(!isValid) {
        ev.stopPropagation()
        ev.preventDefault()
        return
      }
      selectedElement.set(ev.target)
      handleToggleSelect(false)
    }

    function resetIndicator() {
      hoverIndicator.style.left = `0px`
      hoverIndicator.style.top = `0px`
      hoverIndicator.style.width = `0px`
      hoverIndicator.style.height = `0px`
      hoverIndicator.style.display = 'none'
    }

    function handleToggleSelect(selected) {
      isEnabled = selected;
      if(isEnabled) {
        document.addEventListener('mouseover', mouseOverListener)
        document.addEventListener('click', targetClickListener)
        hoverIndicator.style.display = 'block'
      } else {
        document.removeEventListener('mouseover', mouseOverListener)
        document.removeEventListener('click', targetClickListener)
        resetIndicator()
      }
    }

    onDestroy(() => {
      document.removeEventListener('mouseover', mouseOverListener)
      document.removeEventListener('click', targetClickListener)
      resetIndicator()
    })
</script>


<button on:click={() => handleToggleSelect(!isEnabled)}>
  {#if !isEnabled}
    Click to start selecting target element
  {:else}
    Stop element selection
  {/if}
</button>

<div bind:this={hoverIndicator} class="hover-indicator"></div>

<style>
  .hover-indicator {
    display: none;
    position: fixed;
    pointer-events: none;
  }

  .hover-indicator:before {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: "";
    border: 2px solid black;
  }
</style>