import { type IEvent } from '@infra/events/interface'

export class EventMock implements IEvent {
  public messages: string[] = []

  async publish(message: string): Promise<void> {
    this.messages.push(message)
  }
}
