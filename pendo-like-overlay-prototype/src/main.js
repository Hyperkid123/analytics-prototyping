import App from './App.svelte'

const ENTRY_ELEM_ID = '__guide-building-root__'

const prevRoot = document.getElementById(ENTRY_ELEM_ID)
if (prevRoot) {
  document.body.removeChild(prevRoot)
}

const element = document.createElement('div')
element.id = 'ENTRY_ELEM_ID'
element.dataset.guideControl = 'true'
document.body.append(element)

const app = new App({
  target: element,
})

export default app
