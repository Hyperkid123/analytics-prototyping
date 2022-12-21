<script>
  import GuidesPropertiesEditor from './lib/GuidesPropertiesEditor.svelte'
  import GuidesMainControls from './lib/GuidesMainControls.svelte'
  import { selectedElement } from './stores/selectedElement'
  import PreviewRenderer from './lib/PreviewRenderer.svelte'
  import { onMount } from 'svelte'
  import { guideLayout } from './stores/guideLayouts'

  function getGuideBase() {
    const id = 'simple-banner'
    fetch('http://localhost:3000/api/guide-layout')
      .then((r) => r.json())
      .then(({ layouts }) => {
        const requestedLayout = layouts.find((layout) => layout.id === id)
        guideLayout.set(requestedLayout)
      })
  }

  onMount(() => {
    getGuideBase()
  })
</script>

<div class="editor-root">
  {#if $selectedElement}
    <!-- Display only once selected element is set -->
    <GuidesPropertiesEditor />
    <PreviewRenderer />
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
