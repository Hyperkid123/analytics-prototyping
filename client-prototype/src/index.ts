export type EventFunction = (
  eventName: string,
  eventPayload?: string | Record<string | number, any>,
  context?: Record<string, any>
) => void;
export type IdentifyFunction<
  U extends Record<string, any> = Record<string, any>
> = (user: U) => Promise<any>;
export type UpdateContextFunction<C extends Record<string, any> = {}> = (
  context: C
) => void;

export type PageEvent = Record<string, any> & {
  pathname?: string;
  url?: string;
};
export type PageEventFunction<
  D extends PageEvent = Record<string, any>,
  C extends Record<string, any> = {}
> = (pageEvent?: D, context?: C) => void;

export type JourneyHandlers = {
  event: (
    journeyStep: string,
    journeyEvent: string | Record<string | number, any>
  ) => void;
  cancel: () => void;
  finish: () => void;
};
export type CreateJourneyFunction = (journeyName: string) => JourneyHandlers;

class AnalyticsClient<
  U extends Record<string, any> = Record<string, any>,
  C extends Record<string, any> = {},
  P extends PageEvent = Record<string, any>
> {
  private _endpoint: string;
  private _customEventEndpoint = "/event";
  private _user: U;
  private _context?: C;
  private _sessionId?: string;
  private _ready: boolean = false;
  private _buffer: {url: string, payload: string}[] = []
  constructor({
    endpoint,
    user,
    context,
  }: {
    endpoint: string;
    user: U;
    context?: C;
  }) {
    this._endpoint = endpoint;
    this._user = user;
    this._context = context;
  }

  private fetchData(url: string, body?: string) {
    return fetch(`${this._endpoint}${url}`, {
      method: "POST",
      ...(body && {
        headers: {
          "Content-type": "application/json",
        },
        body
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data?.init && data?.uuid) {
          this._sessionId = data.uuid;
        }
        return data;
      });
  }

  private emit(
    url: string,
    eventPayload: Record<string | number, any>
  ) {
    const payload = typeof eventPayload === "string"
    ? eventPayload
    : JSON.stringify({
        ...eventPayload,
        sessionId: this._sessionId,
        timestamp: Date.now(),
      })
      if(this.getReady()) {
        this.fetchData(url, payload)
      } else {
        this._buffer.push({url, payload})
      }
      
  }

  updateContext: UpdateContextFunction<C> = (context) => {
    this._context = context;
  };

  identify: IdentifyFunction<U> = async (user) => {
    const event = {
      type: "identify",
      payload: user,
    };
    this._ready = false
    const data = await this.emit(this._customEventEndpoint, event);
    this._ready = true
    if(this._buffer.length > 0) {
      this._buffer.forEach(({ url, payload }) => this.fetchData(url, payload))
    }
    this._buffer = []
    return data
  };

  getReady = () => this._ready

  event: EventFunction = (eventName, eventPayload, context) => {
    if (eventName) {
      const event = {
        type: eventName,
        payload: eventPayload,
        user: this._user,
        context: context ?? this._context,
      };
      this.emit(this._customEventEndpoint, event);
    }
  };

  page: PageEventFunction<P, C> = (pageEvent, context) => {
    const location = window.location;
    const internalPageEvent = {
      pathname: location.pathname,
      url: location.href,
      ...pageEvent,
    };
    this.event("page", internalPageEvent, context);
  };

  createJourney: CreateJourneyFunction = (journeyName) => {
    // create proper journey ID generator
    const journeyId = `${Date.now()}-${Math.random()}`;
    const startEvent = {
      type: "journey-start",
      journeyName,
      journeyId,
      user: this._user,
      context: this._context,
    };
    return {
      start: () => {
        this.emit(this._customEventEndpoint, startEvent);
      },
      cancel: () => {
        const event = {
          type: "journey-cancel",
          journeyId,
          journeyName,
          user: this._user,
          context: this._context,
        };
        this.emit(this._customEventEndpoint, event);
      },
      finish: () => {
        const event = {
          type: "journey-finish",
          journeyId,
          journeyName,
          user: this._user,
          context: this._context,
        };
        this.emit(this._customEventEndpoint, event);
      },
      event: (journeyStep, journeyEvent) => {
        const event = {
          type: "journey-event",
          journeyId,
          journeyName,
          journeyStep,
          journeyEvent,
          user: this._user,
          context: this._context,
        };
        this.emit(this._customEventEndpoint, event);
      },
    };
  };
}

export default AnalyticsClient;
