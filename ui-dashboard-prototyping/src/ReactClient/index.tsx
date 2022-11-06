import ClientPrototype from '@analytics-prototyping/client-prototype'
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'


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

const ReactClientProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<ReactClientProviderState>({
    ready: false,
    client: undefined
  })

  useEffect(() => {
    const client = new ClientPrototype()
    setState({
      ready: true,
      client,
    })
  }, [])

  function event(eventName: string, eventValue?: string | Record<string | number, any>) {
    
  }

  return (
    <ReactClientContext.Provider value={state}>
      {children}
    </ReactClientContext.Provider>
  )
}

export default ReactClientProvider;

