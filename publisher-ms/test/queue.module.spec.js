const Queue = require('../src/modules/queue.module');
const amqp = require('amqplib');

jest.mock('amqplib');
jest.mock('../src/config/config', () => ({
    PASSWORD: 'pass',
    RABBITMQ: 'localhost',
    USERNAME: 'user'
}));

describe('QueueModule', () => {
    let mockChannel;
    let mockConnection;

    beforeEach(() => {
        mockChannel = {
            assertQueue: jest.fn().mockResolvedValue({}),
            createConfirmChannel: jest.fn(),
            on: jest.fn(),
            sendToQueue: jest.fn((q, c, o, cb) => cb(null, true)),
        };
        mockConnection = {
            createConfirmChannel: jest.fn().mockResolvedValue(mockChannel),
            on: jest.fn(),
        };
        amqp.connect.mockResolvedValue(mockConnection);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should connect and create a channel', async () => {
        const queue = new Queue('test-queue');

        // Wait for connection logic to run
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(amqp.connect).toHaveBeenCalled();
        expect(mockConnection.createConfirmChannel).toHaveBeenCalled();
        expect(mockChannel.assertQueue).toHaveBeenCalledWith('test-queue', { durable: true });
    });

    it('should publish messages', async () => {
        const queue = new Queue('test-queue');
        await new Promise(resolve => setTimeout(resolve, 100));

        const message = { data: 'test' };
        await queue.publish(message);

        expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
            'test-queue',
            Buffer.from(JSON.stringify(message)),
            { persistent: true },
            expect.any(Function)
        );
    });

    it('should queue messages if channel is not ready', async () => {
        const queue = new Queue('test-queue');
        // Don't wait for connection

        const message = { data: 'offline' };
        await queue.publish(message);

        expect(mockChannel.sendToQueue).not.toHaveBeenCalled();
        expect(queue.offlinePubQueue).toContain(message);
    });
});
