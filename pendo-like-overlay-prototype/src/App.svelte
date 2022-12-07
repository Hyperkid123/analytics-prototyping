<script>
  import GuidesMainControls from "./lib/GuidesMainControls.svelte";

  let containerPositionTop = 0
  let containerPositionLeft = 0


  var isMouseDown = false;
  addEventListener("mousedown", ()=>isMouseDown = true);
  addEventListener("mouseup", ()=>isMouseDown = false);

  function drag(ev) {
    const rect = ev.target.getBoundingClientRect();
    containerPositionTop = ev.pageY
    containerPositionLeft = ev.pageX
  }

  function dragEnd(ev) {
    containerPositionTop = ev.pageY
    containerPositionLeft = ev.pageX
  }

  function dragStart(ev) {        
    const crt = this.cloneNode(true);
    // crt.style.display = "none"; hide the drag ghost
    ev.dataTransfer.setDragImage(crt, 0, 0);
    ev.dataTransfer.dropEffect = "move";
    ev.dataTransfer
    .setData("text", ev.target.getAttribute('id'));
  }
</script>

<div id="guide-overlay-main-container" style="left: {containerPositionLeft}px; top: {containerPositionTop}px" class="overlay" on:dragstart={dragStart} on:dragend={dragEnd} on:drag={drag} draggable="true">
  <div draggable="false">
    <h1>There will be dragons</h1>
  </div>
</div>
<GuidesMainControls />

<style>
  .overlay {
    background-color: azure;
    position: fixed;
  }
</style>
