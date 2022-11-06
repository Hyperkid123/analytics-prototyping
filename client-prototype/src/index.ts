export type EventFunction = (eventName: string, eventPayload?: string | Record<string | number, any>) => void
export type IdentifyFunction<U extends Record<string, any> = Record<string, any>> = (user: U) => Promise<any>
export type UpdateContextFunction<C extends Record<string, any> = {}> = (context: C) => void


class AnalyticsClient<
  U extends Record<string, any> = Record<string, any>,
  C extends Record<string, any> = {}
> {
  private _endpoint: string
  private _customEventEndpoint = '/event'
  private _user: U
  private _context?: C
  constructor({
    endpoint,
    user,
    context
  }: {
    endpoint: string,
    user: U,
    context?: C
  }) {
    this._endpoint = endpoint
    this._user = user
    this._context = context;
  }

  private emit(url: string, eventPayload: string | Record<string | number, any>) {
    return fetch(`${this._endpoint}${url}`, {
      method: 'POST',
      ...(eventPayload && {        
        headers: {
          'Content-type': typeof eventPayload === 'string' ? 'text' : 'application/json'
        },
        body: typeof eventPayload === 'string' ? eventPayload : JSON.stringify(eventPayload)
      })
    })
  }

  updateContext: UpdateContextFunction<C> = (context) => {
    this._context = context
  }

  identify: IdentifyFunction<U> = (user) => {
    const event = {
      type: 'identify',
      payload: user,
    }
    return this.emit(this._customEventEndpoint, event)
  }

  event: EventFunction = (eventName, eventPayload) => {    
    if(eventName) {
      const event = {
        type: eventName,
        payload: eventPayload,
        user: this._user,
        context: this._context
      }
      this.emit(this._customEventEndpoint, event)
    }
  }
}

export default AnalyticsClient;
