<script>
  import Div from './Div.svelte'
  import Span from './Span.svelte'

  let elementRef
  const componentMapper = {
    span: Span,
    div: Div,
  }

  export let children = []
  export let defaultElement = ''
  export let defaultStyle = {}

  function passRef(ref) {
    elementRef = ref
    ref.removeAttribute('style')
    Object.entries(defaultStyle).forEach(([name, value]) => {
      ref.style[name] = value
    })
  }
  const Component = componentMapper[defaultElement]
</script>

<Component {passRef}>
  {#each children as child}
    {#if !child.defaultElement}
      {@html child}
    {:else}
      <svelte:self {...child} children={child.children} />
    {/if}
  {/each}
</Component>
