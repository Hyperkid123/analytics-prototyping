import ClientPrototype, { EventFunction } from '@analytics-prototyping/client-prototype'
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react'


type ReactClientProviderState = {
  ready: boolean;
  client?: ClientPrototype
}

const ReactClientContext = createContext<ReactClientProviderState>({
  ready: false,
  client: undefined
})

export const useClientContext = () => {
  const client = useContext(ReactClientContext)

  return client
}

export const useCustomEvent = () => {
  const { ready, client } = useClientContext()
  const buffer = useRef<[string, undefined | string | Record<string | number, any>][]>([])
  const internalEvent: EventFunction = (eventName, eventPayload) => {
    if(!ready) {
      buffer.current.push([eventName, eventPayload])
    } else {
      client?.event(eventName, eventPayload)
    }
  }

  useEffect(() => {
    if(ready && buffer.current.length > 0) {
      buffer.current.forEach(args => {
        client?.event(...args)
      })
      buffer.current = []
    }
  }, [ready, client])

  return internalEvent
}

export type ReactClientProviderProps = PropsWithChildren<{
  endpoint: string
}>

const ReactClientProvider: React.FC<ReactClientProviderProps> = ({ children, endpoint }) => {
  const [state, setState] = useState<ReactClientProviderState>({
    ready: false,
    client: undefined
  })

  useEffect(() => {
    const client = new ClientPrototype({ endpoint })
    setState({
      ready: true,
      client,
    })
  }, [])

  return (
    <ReactClientContext.Provider value={state}>
      {children}
    </ReactClientContext.Provider>
  )
}

export default ReactClientProvider;

