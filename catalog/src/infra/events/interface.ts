export interface IEvent {
  publish: (message: string) => Promise<void>
}
