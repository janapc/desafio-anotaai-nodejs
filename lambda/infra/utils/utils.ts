import { type SQSRecord } from 'aws-lambda'
import { type Message } from '../../entities/entities'

export function extractData(record: SQSRecord): Message {
  if (!record.body) {
    throw new Error('no Body in SQS Message.')
  }
  const body = JSON.parse(record.body)
  if (!body.Message) {
    throw new Error('no Message in SQS Message.')
  }
  const message = JSON.parse(body.Message as string) as Message
  return message
}
