<script>
  import Select from 'svelte-select'
  import { guideLayout } from '../../stores/guideLayouts'

  let basicPosition = {
    value: 'element',
    label: 'Element relative',
  }
  let elementPosition
  const basicPositionOptions = [
    {
      value: 'element',
      label: 'Element relative',
    },
    {
      value: 'screen',
      label: 'Screen',
    },
    {
      value: 'custom',
      label: 'Custom position',
    },
  ]

  const elementPositionOptions = [
    {
      value: 'top',
      label: 'Top',
    },
    {
      value: 'right',
      label: 'Right',
    },
    {
      value: 'bottom',
      label: 'Bottom',
    },
    {
      value: 'left',
      label: 'Left',
    },
  ]

  const screenPosition = [
    ...elementPositionOptions,
    {
      value: 'center',
      label: 'Center',
    },
  ]

  function handleBasicPositionChange() {
    elementPosition = undefined
  }

  function handleElementPositionChange() {
    const position = elementPosition.value
    guideLayout.update((prev) => ({
      ...prev,
      rootPosition: {
        type: basicPosition.value,
        direction: position,
      },
    }))
  }
</script>

<Select
  items={basicPositionOptions}
  bind:value={basicPosition}
  on:change={handleBasicPositionChange}
/>
{#if basicPosition.value === 'element'}
  <Select
    items={elementPositionOptions}
    bind:value={elementPosition}
    on:change={handleElementPositionChange}
  />
{:else if basicPosition.value === 'screen'}
  <Select
    items={screenPosition}
    bind:value={elementPosition}
    on:change={handleElementPositionChange}
  />
{/if}
