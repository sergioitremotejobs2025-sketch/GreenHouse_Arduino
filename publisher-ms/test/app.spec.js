const { main } = require('../src/app/app')
const amqplib = require('./__mocks__/amqplib')

describe('Publish measures to queue', () => {
  beforeEach(() => {
    amqplib.resetSent()
  })

  it('should send three measures to queue', async () => {
    expect(amqplib.sent()).toEqual(0)
    await main()
    // Give some time for async queue connection/publish if needed
    // But since we mock everything as resolved, it might be immediate
    expect(amqplib.sent()).toEqual(3)
  }, 100000)
})
