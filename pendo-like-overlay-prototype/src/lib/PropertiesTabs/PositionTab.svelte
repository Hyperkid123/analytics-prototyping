<script>
  import Select from 'svelte-select'
  import { guideLayout } from "../../stores/guideLayouts"
  import { selectedElement } from "../../stores/selectedElement"
  import TabBody from './TabBody.svelte'

  let basicPosition = {
    value: 'element',
    label: 'Element relative'
  }
  let elementPosition = {
    value: 'bottom',
    label: 'Bottom'
  }
  const basicPositionOptions = [{
    value: 'element',
    label: 'Element relative'
  }, {
    value: 'centered',
    label: 'Screen centered'
  }, {
    value: 'custom',
    label: 'Custom position'
  }]

  const elementPositionOptions = [{
    value: 'top',
    label: 'Top'
  },{
    value: 'right',
    label: 'Right'
  },{
    value: 'bottom',
    label: 'Bottom'
  },{
    value: 'left',
    label: 'Left'
  }]

  function handleElementPositionChange() {
    const position = elementPosition.value
    guideLayout.update(prev => ({
      ...prev,
      rootPosition: {
        type: 'element',
        direction: position
      }
    }))
  }


</script>

<Select items={basicPositionOptions} bind:value={basicPosition}/>
{#if basicPosition.value === 'element'}
<Select items={elementPositionOptions} bind:value={elementPosition} on:change={handleElementPositionChange}/>
{/if}

<style>

</style>