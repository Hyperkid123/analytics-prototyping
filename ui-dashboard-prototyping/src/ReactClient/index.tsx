import ClientPrototype from '@analytics-prototyping/client-prototype'
import { createContext, PropsWithChildren, useEffect, useState } from 'react'


type ReactClientProviderState = {
  ready: boolean;
  client?: ClientPrototype
}

const ReactClientContext = createContext<ReactClientProviderState>({
  ready: false,
  client: undefined
})

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
  return (
    <ReactClientContext.Provider value={state}>
      {children}
    </ReactClientContext.Provider>
  )
}

export default ReactClientProvider;

