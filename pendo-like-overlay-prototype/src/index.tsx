import React, { PropsWithChildren, useEffect, useReducer, useRef, useState } from 'react';
import { createPortal } from 'react-dom'
import { createRoot } from 'react-dom/client'

type MapEntry = {Component: React.ComponentType<PropsWithChildren>, title: React.ReactNode}
const thingsDB = new Map<HTMLElement, MapEntry[]>()

const handleAddThing = (selectedElement: HTMLElement) => {
  let entry: MapEntry[] = [];
  if(thingsDB.has(selectedElement)) {
    entry = thingsDB.get(selectedElement)!
  } else {
    entry = []
  }

  const Component: any = 'h2'
  entry.push({
    Component: ({children}) => <Component data-id="internal">{children}</Component>,
    title: entry.length
  })
  thingsDB.set(selectedElement, entry)
}

const PopUpBase = ({ selectedElement }: {selectedElement: HTMLElement}) => {
  const [, forceRender] = useReducer(count => count + 1, 0)
  const pos = selectedElement.getBoundingClientRect()
  const entries = thingsDB.get(selectedElement)

  const handleClick = () => {
    handleAddThing(selectedElement)
    forceRender()
  }
  return (
    <div data-id="internal" style={{ padding: 8, background: 'white', position: 'absolute', top: pos.top, left: pos.left + pos.width, border: '1px solid black', borderRadius: '5px' }}>
      <button data-id="internal" onClick={handleClick}>
        Add a thing
      </button>
      {entries?.map(({ Component, title }, index) => <Component key={index}>{title}</Component> )}
    </div>
  )
}

const selectionListener = () => {
  const overlayElement = document.createElement('div')
  overlayElement.style.position = 'absolute'
  overlayElement.style.background = 'green'
  overlayElement.style.width = '0'
  overlayElement.style.height = '0'
  overlayElement.style.pointerEvents = 'none'
  overlayElement.style.opacity = '.5'
  document.body.appendChild(overlayElement)

  const listenerFunction = function (event: MouseEvent){
    const elem: HTMLElement | null = event.target as HTMLElement
    if(elem) {
      const pos = elem.getBoundingClientRect()
      overlayElement.style.top = `${pos.top}px`
      overlayElement.style.left = `${pos.left}px`
      overlayElement.style.right = `${pos.right}px`
      overlayElement.style.bottom = `${pos.bottom}px`
      overlayElement.style.width = `${pos.width}px`
      overlayElement.style.height = `${pos.height}px`
    }
  }
  document.addEventListener('mouseover', listenerFunction)
  return () => {
    document.removeEventListener('mouseover', listenerFunction)
    document.body.removeChild(overlayElement)
  }
}

const createSelectionListener = (selectElement: (elem: HTMLElement) =>  void) => {
  function clickListener(event: MouseEvent) {
    if(event.target && (event.target as HTMLElement).dataset?.id !== 'internal') {
      selectElement(event.target as HTMLElement)
    }
  }
  return {
    listen: () => {
      document.removeEventListener('click', clickListener)
      document.addEventListener('click', clickListener)
    },
    unListen: () => document.removeEventListener('click', clickListener)
  }
}

const PendoDevMode = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedElement, setSelectedElement] = useState<HTMLElement | undefined>()
  const clickSelectionListener = useRef(createSelectionListener(setSelectedElement))
  const [PopUpPortal, setPopUpPortal] = useState<React.ReactPortal | undefined>()
  useEffect(() => {
    let unlisten: undefined | (() => void);

    if(isOpen) {
      unlisten = selectionListener()
      clickSelectionListener.current.listen()
    } else {
      unlisten?.()
      clickSelectionListener.current.unListen()
    }
    return () => {
      unlisten?.()
      clickSelectionListener.current.unListen()
    }
  }, [isOpen])

  useEffect(() => {
    if(selectedElement) {
      const ps = createPortal(<PopUpBase selectedElement={selectedElement} />, document.body)
      setPopUpPortal(ps)
    }
  }, [selectedElement])

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100vh',
      background: 'tomato',
      padding: 16,
      width: 300,
      transition: 'transform .5s',
      transform: `translate(${isOpen ? 0 : '-300px'})`
    }}>
      <h1>
        This is a dev mode
      </h1>
      <button onClick={() => setIsOpen(false)}>
        Close dev mode
      </button>
      <button style={{
        position: 'fixed',
        transition: 'transform .5s',
        top: 0,
        transform: `translate(${isOpen ? '-300px' : '200px'})`
        
      }} onClick={() => setIsOpen(true)}>
        Open dev mode
      </button>
      {PopUpPortal ? PopUpPortal : null}
    </div>
  )
}


export const init = () => {
  const rootElement = document.createElement('div')
  document.body.appendChild(rootElement)
  const root = createRoot(rootElement)
  return {
    render: () => root.render(<PendoDevMode />),
    unmount: () => root.unmount()
  }
}
