import ClientPrototype, {
  EventFunction,
  JourneyHandlers,
} from "@analytics-prototyping/client-prototype";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type ReactClientProviderState = {
  ready: boolean;
  client: ClientPrototype;
  user?: Record<string | number, any>;
};

const ReactClientContext = createContext<ReactClientProviderState>({
  ready: false,
  client: undefined as unknown as ClientPrototype,
});

export const useClientContext = () => {
  const client = useContext(ReactClientContext);

  return client;
};

export const useUpdateContext = () => {
  const { client } = useContext(ReactClientContext);
  return client.updateContext;
};

export const useCustomEvent = () => {
  const { client } = useClientContext();
  return client.event;
};

export const useIdentify = () => {
  const { client } = useClientContext();
  return client.identify;
};

export const usePageEvent = () => {
  const { client } = useClientContext();
  return client.page;
};

export const useCreateJourney = (journeyName: string) => {
  const { ready, client } = useClientContext();
  const mounted = useRef(false);
  const journeyEvents = useRef<JourneyHandlers>();
  const buffers = useRef<{
    start: [];
    event: [
      journeyStep: string,
      journeyEvent: string | Record<string | number, any>
    ][];
    cancel: [];
    finish: [];
  }>({
    start: [],
    event: [],
    cancel: [],
    finish: [],
  });
  const internalEvent: JourneyHandlers["event"] = (...args) => {
    if (ready && journeyEvents.current?.event) {
      journeyEvents.current.event(...args);
    } else {
      buffers.current.event.push(args);
    }
  };

  const internalCancel: JourneyHandlers["cancel"] = () => {
    if (ready && journeyEvents.current?.cancel) {
      journeyEvents.current.cancel();
    } else {
      buffers.current.cancel.push();
    }
  };

  const internalFinish: JourneyHandlers["finish"] = () => {
    if (ready && journeyEvents.current?.finish) {
      journeyEvents.current.finish();
    } else {
      buffers.current.finish.push();
    }
  };

  const internalStart: JourneyHandlers["start"] = () => {
    if (ready && journeyEvents.current?.start) {
      journeyEvents.current.start();
    } else {
      buffers.current.start.push();
    }
  };

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    }
    if (ready && client && !journeyEvents.current) {
      journeyEvents.current = client.createJourney(journeyName);
    }
  }, [ready, client, journeyName]);
  return {
    start: internalStart,
    event: internalEvent,
    cancel: internalCancel,
    finish: internalFinish,
  };
};

export type ReactClientProviderProps<
  U extends Record<string, any> = Record<string, any>,
  C extends Record<string, any> = Record<string, any>
> = PropsWithChildren<{
  endpoint: string;
  user: U;
  context?: C;
}>;

const ReactClientProvider: React.FC<ReactClientProviderProps> = ({
  children,
  endpoint,
  user,
  context,
}) => {
  const [state, setState] = useState<ReactClientProviderState>({
    ready: false,
    client: new ClientPrototype({ endpoint, user, context }),
  });
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current && !state.ready) {
      isMounted.current = true;
      state.client.identify(user).then(() => {
        setState((prev) => ({
          ...prev,
          ready: state.client.getReady(),
        }));
      });
    }
  }, []);

  return (
    <ReactClientContext.Provider value={state}>
      {children}
    </ReactClientContext.Provider>
  );
};

export default ReactClientProvider;
