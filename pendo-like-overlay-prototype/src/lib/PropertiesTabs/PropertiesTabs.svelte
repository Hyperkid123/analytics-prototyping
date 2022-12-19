<script>
  import { activeEditorTab } from '../../stores/activeEditorTab'

  let tabItems = [
    {
      id: 'content',
      title: 'Content',
    },
    {
      id: 'style',
      title: 'Styling',
    },
    {
      id: 'position',
      title: 'Position',
    },
  ]
  function handleTabClick(tabId) {
    activeEditorTab.set(tabId)
  }
</script>

<div>
  <div class="tabs-list">
    {#each tabItems as { id, title }}
      <button
        on:click={() => handleTabClick(id)}
        class:active={id === $activeEditorTab}
        class="tab-list-item">{title}</button
      >
    {/each}
  </div>
</div>

<style>
  .tabs-list {
    padding: 0.5em;
    display: flex;
  }
  .tabs-list .tab-list-item:not(:last-child) {
    margin-right: 0.5em;
  }

  .tabs-list .tab-list-item {
    position: relative;
    cursor: pointer;
    background: none;
    border: none;
  }
  .tabs-list .tab-list-item:hover::before {
    pointer-events: none;
    position: absolute;
    left: 0;
    top: 0;
    bottom: -0.15em;
    right: 0;
    content: '';
    border-bottom: 1px solid black;
  }

  .tabs-list .tab-list-item.active::before {
    pointer-events: none;
    position: absolute;
    left: 0;
    top: 0;
    bottom: -0.2em;
    right: 0;
    content: '';
    border-bottom: 2px solid black;
  }
</style>
