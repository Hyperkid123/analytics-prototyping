<script>
  import GuidesPropertiesEditor from "./lib/GuidesPropertiesEditor.svelte";
  import GuidesMainControls from "./lib/GuidesMainControls.svelte";
  import { selectedElement } from "./stores/selectedElement";
</script>

{#if $selectedElement}
  <!-- Display only once selected element is set -->
  <GuidesPropertiesEditor />
{/if}
<GuidesMainControls />
