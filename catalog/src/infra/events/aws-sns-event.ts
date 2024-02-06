import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'

import { type IEvent } from './interface'

export class AwsSnsEvent implements IEvent {
  private readonly topic: string
  private readonly client: SNSClient

  constructor(topic: string) {
    this.topic = topic
    this.client = this._getClient()
  }

  _getClient(): SNSClient {
    const snsClient = new SNSClient({
      region: String(process.env.AWS_REGION),
      endpoint: String(process.env.AWS_ENDPOINT),
      credentials: {
        accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
        secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
      },
    })
    return snsClient
  }

  async publish(message: string): Promise<void> {
    const response = await this.client.send(
      new PublishCommand({
        Message: message,
        TopicArn: this.topic,
      }),
    )
    console.info(
      `${new Date().toISOString()} [publish-message] messageID:`,
      response.MessageId,
    )
  }
}
