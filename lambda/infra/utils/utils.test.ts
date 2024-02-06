import { extractData } from './utils'

const sqsRecordMock = {
  messageId: '2e1424d4-123-459a-8184-3123',
  receiptHandle: 'adsa+/7q1rGgNqicHq...',
  attributes: {
    ApproximateReceiveCount: '1',
    SentTimestamp: 'dasd2342',
    SenderId: 'asd12312',
    ApproximateFirstReceiveTimestamp: 'adasd2432',
  },
  messageAttributes: {},
  md5OfBody: 'asd2312',
  eventSource: 'aws:sqs',
  eventSourceARN: 'arn:aws:sqs:us-east-2:123456789012:my-queue',
  awsRegion: 'us-east-2',
}

describe('Utils ExtractData', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('Should return message formatted', () => {
    const message = extractData({
      ...sqsRecordMock,
      body: JSON.stringify({
        Message: JSON.stringify({
          id: 'test',
          title: 'test',
          description: 'test',
          ownerId: 'test',
          type: 'test',
        }),
      }),
    })
    expect(message).not.toEqual(null)
  })

  it('Should return an error if body is empty', () => {
    expect(() =>
      extractData({
        ...sqsRecordMock,
        body: '',
      }),
    ).toThrow('no Body in SQS Message.')
  })

  it('Should return an error if message is empty', () => {
    expect(() =>
      extractData({
        ...sqsRecordMock,
        body: JSON.stringify({ Message: '' }),
      }),
    ).toThrow('no Message in SQS Message.')
  })
})
