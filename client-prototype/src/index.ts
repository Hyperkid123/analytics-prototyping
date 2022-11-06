export type EventFunction = (eventName: string, eventPayload?: string | Record<string | number, any>) => void
export type IdentifyFunction<U extends Record<string, any> = Record<string, any>> = (user: U) => Promise<any>


class AnalyticsClient<U extends Record<string, any> = Record<string, any>> {
  private _endpoint: string
  private _customEventEndpoint = '/event'
  private _user: U
  constructor({
    endpoint,
    user
  }: {
    endpoint: string,
    user: U
  }) {
    this._endpoint = endpoint
    this._user = user
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

  identify: IdentifyFunction<U> = (user) => {
    const event = {
      type: 'identify',
      payload: user
    }
    return this.emit(this._customEventEndpoint, event)
  }

  event: EventFunction = (eventName, eventPayload) => {    
    if(eventName) {
      const event = {
        type: eventName,
        payload: eventPayload
      }
      this.emit(this._customEventEndpoint, event)
    }
  }
}

export default AnalyticsClient;
