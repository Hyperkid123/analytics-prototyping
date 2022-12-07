<script>
  import GuidesPropertiesEditor from "./lib/GuidesPropertiesEditor.svelte";
  import GuidesMainControls from "./lib/GuidesMainControls.svelte";
  import { selectedElement } from "./stores/selectedElement";
    import { onDestroy } from "svelte";

  const unsubscribe = selectedElement.subscribe(value => {
		console.log(value)
	});

  // clean up subscribtion
  onDestroy(() => {
    unsubscribe()
  })
</script>

<GuidesPropertiesEditor />
<GuidesMainControls />
