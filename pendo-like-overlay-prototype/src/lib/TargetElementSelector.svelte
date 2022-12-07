<script>
    import { onDestroy } from "svelte";
    import { selectedElement } from "../stores/selectedElement";
    let isEnabled = false

    function mouseOverListener(ev) {
      const isValid = !ev.target.closest("[data-guide-control=true]")
      if(!isValid) {
        ev.stopPropagation()
        ev.preventDefault()
        return
      }
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

    function handleToggleSelect(selected) {
      isEnabled = selected;
      if(isEnabled) {
        document.addEventListener('mouseover', mouseOverListener)
        document.addEventListener('click', targetClickListener)
      } else {
        document.removeEventListener('mouseover', mouseOverListener)
        document.removeEventListener('click', targetClickListener)
      }
    }

    onDestroy(() => {
      document.removeEventListener('mouseover', mouseOverListener)
      document.removeEventListener('click', targetClickListener)
    })
</script>


<button on:click={() => handleToggleSelect(!isEnabled)}>
  {#if !isEnabled}
    Click to start selecting target element
  {:else}
    Stop element selection
  {/if}
</button>