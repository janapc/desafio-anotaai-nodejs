import { AwsSnsEvent } from './aws-sns-event'

const mockSnsInstance = {
  send: jest.fn().mockResolvedValue({ MessageId: 'asd-123' }),
}

jest.mock('@aws-sdk/client-sns', () => {
  return {
    SNSClient: jest.fn(() => mockSnsInstance),
    PublishCommand: jest.fn().mockReturnThis(),
  }
})

describe('Aws Sns Event', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('Should send message to topic', async () => {
    const spySend = jest.spyOn(mockSnsInstance, 'send')
    const event = new AwsSnsEvent('test-topic')
    await event.publish('test')
    expect(spySend).toHaveBeenCalledTimes(1)
  })
})
