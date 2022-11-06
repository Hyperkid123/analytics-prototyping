import ClientPrototype, { EventFunction } from '@analytics-prototyping/client-prototype'
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react'


type ReactClientProviderState = {
  ready: boolean;
  client?: ClientPrototype,
  user?: Record<string | number, any>
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

export const useIdentify = () => {
  const { ready, client } = useClientContext()
  const buffer = useRef<Record<string | number, any>[]>([])
  const internalEvent = <U extends Record<string, any> = Record<string, any>>(user: U) => {
    if(!ready) {
      buffer.current.push(user)
    } else {
      client?.identify(user)
    }
  }

  useEffect(() => {
    if(ready && buffer.current.length > 0) {
      buffer.current.forEach(user => {
        client?.identify(user)
      })
      buffer.current = []
    }
  }, [ready, client])

  return internalEvent
}

export type ReactClientProviderProps<U extends Record<string, any> = Record<string, any>> = PropsWithChildren<{
  endpoint: string,
  user: U
}>

const ReactClientProvider: React.FC<ReactClientProviderProps> = ({ children, endpoint, user }) => {
  const [state, setState] = useState<ReactClientProviderState>({
    ready: false,
    client: undefined
  })

  useEffect(() => {
    const client = new ClientPrototype({ endpoint, user })
    client.identify(user).then(() => {
      setState({
        ready: true,
        client,
        user,
      })
    })
  }, [])

  return (
    <ReactClientContext.Provider value={state}>
      {children}
    </ReactClientContext.Provider>
  )
}

export default ReactClientProvider;

