<script>
  import GuidesPropertiesEditor from './lib/GuidesPropertiesEditor.svelte'
  import GuidesMainControls from './lib/GuidesMainControls.svelte'
  import { selectedElement } from './stores/selectedElement'
</script>

<div class="editor-root">
  {#if $selectedElement}
    <!-- Display only once selected element is set -->
    <GuidesPropertiesEditor />
  {/if}
  <GuidesMainControls />
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

  .editor-root {
    font-family: 'Roboto';
    position: fixed;
  }
</style>
