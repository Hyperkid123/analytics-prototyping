export type EventFunction = (eventName: string, eventPayload?: string | Record<string | number, any>) => void


class AnalyticsClient {
  private _endpoint: string
  private _customEventEndpoint = '/event'
  constructor({
    endpoint
  }: {
    endpoint: string
  }) {
    this._endpoint = endpoint
  }

  private emit(url: string, eventPayload: string | Record<string | number, any>) {
    fetch(`${this._endpoint}${url}`, {
      method: 'POST',
      ...(eventPayload && {        
        headers: {
          'Content-type': typeof eventPayload === 'string' ? 'text' : 'application/json'
        },
        body: typeof eventPayload === 'string' ? eventPayload : JSON.stringify(eventPayload)
      })
    })
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
