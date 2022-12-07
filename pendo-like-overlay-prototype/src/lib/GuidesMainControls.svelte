<script>
  import { selectedElement } from '../stores/selectedElement'
  let controlsAlign = 'bottom'
  const controlAlignOptions = [
    'left', 'top', 'right', 'bottom'
  ]

  function selectElement() {
    selectedElement.set(document.getElementById('random-target'))
  }
</script>

<div class="controls {controlsAlign}" id="guide-builder-controls">
  <select bind:value={controlsAlign}>
    {#each controlAlignOptions as value}<option {value}>{value}</option>{/each}
  </select>
  <button on:click={selectElement}>
    Select element with random-target ID
  </button>
</div>

<style>
.controls {
    position: fixed;
    background-color: coral;
    padding: 8px;
  }
  .controls.bottom {
    bottom: 0;
    width: 100vw;
  }
  .controls.left {
    top: 0;
    left: 0;
    height: 100vh;
  }
  .controls.right {
    top: 0;
    right: 0;
    height: 100vh;
  }

  .controls.top {
    top: 0;
    width: 100vw;
  }
</style>