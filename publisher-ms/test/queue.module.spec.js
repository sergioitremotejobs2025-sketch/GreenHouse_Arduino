// Tests for queue.module in publisher-ms
const amqp = require('amqplib');
jest.mock('amqplib');

// Mock config values
jest.mock('../src/config/config', () => ({
    PASSWORD: 'pass',
    RABBITMQ: 'localhost',
    USERNAME: 'user'
}));

const Queue = require('../src/modules/queue.module');

describe('Queue module', () => {
    let mockChannel, mockConnection;
    beforeEach(() => {
        mockChannel = {
            sendToQueue: jest.fn((q, content, opts, cb) => cb(null, true)),
            assertQueue: jest.fn().mockResolvedValue({}),
            on: jest.fn()
        };
        mockConnection = {
            createConfirmChannel: jest.fn().mockResolvedValue(mockChannel),
            on: jest.fn()
        };
        amqp.connect.mockResolvedValue(mockConnection);
    });

    test('connect establishes connection and channel', async () => {
        const q = new Queue('testQueue');
        await new Promise(r => setTimeout(r, 10));
        expect(amqp.connect).toHaveBeenCalled();
        expect(mockConnection.createConfirmChannel).toHaveBeenCalled();
        expect(mockChannel.assertQueue).toHaveBeenCalledWith('testQueue', { durable: true });
    });

    test('handles connection error and close', async () => {
        const q = new Queue('testQueue');
        await new Promise(r => setTimeout(r, 10));

        // Find correctly registered error and close handlers
        const errorHandlers = mockConnection.on.mock.calls.filter(call => call[0] === 'error');
        const closeHandlers = mockConnection.on.mock.calls.filter(call => call[0] === 'close');

        expect(errorHandlers.length).toBeGreaterThan(0);
        expect(closeHandlers.length).toBeGreaterThan(0);

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        // Trigger error
        errorHandlers[0][1](new Error('connection fail'));
        expect(consoleErrorSpy).toHaveBeenCalledWith('[AMQP] connection error', 'connection fail');

        // Trigger close
        const reconnectSpy = jest.spyOn(q, 'reconnect').mockImplementation(() => { });
        closeHandlers[0][1]();
        expect(consoleErrorSpy).toHaveBeenCalledWith('[AMQP] connection closed, reconnecting...');
        expect(reconnectSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
        reconnectSpy.mockRestore();
    });

    test('handles channel error and close', async () => {
        new Queue('testQueue');
        await new Promise(r => setTimeout(r, 10));

        const errorHandlers = mockChannel.on.mock.calls.filter(call => call[0] === 'error');
        const closeHandlers = mockChannel.on.mock.calls.filter(call => call[0] === 'close');

        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        errorHandlers[0][1](new Error('channel fail'));
        expect(consoleErrorSpy).toHaveBeenCalledWith('[AMQP] channel error', 'channel fail');

        closeHandlers[0][1]();
        expect(consoleLogSpy).toHaveBeenCalledWith('[AMQP] channel closed');

        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    test('publish sends message when channel ready', async () => {
        const q = new Queue('testQueue');
        await new Promise(r => setTimeout(r, 10));
        const msg = { foo: 'bar' };
        await q.publish(msg);
        expect(mockChannel.sendToQueue).toHaveBeenCalled();
    });

    test('publish handles nack from channel', async () => {
        const q = new Queue('testQueue');
        await new Promise(r => setTimeout(r, 10));

        // Mock nack
        mockChannel.sendToQueue.mockImplementationOnce((q, c, o, cb) => cb(new Error('nack')));

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        const msg = { foo: 'bar' };
        await q.publish(msg);

        expect(q.offlinePubQueue).toContainEqual(msg);
        expect(consoleErrorSpy).toHaveBeenCalledWith('[AMQP] nack/error publishing', expect.any(Error));
        consoleErrorSpy.mockRestore();
    });

    test('publish handles unexpected throw', async () => {
        const q = new Queue('testQueue');
        await new Promise(r => setTimeout(r, 10));

        mockChannel.sendToQueue.mockImplementationOnce(() => { throw new Error('critical'); });

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        const msg = { foo: 'bar' };
        await q.publish(msg);

        expect(q.offlinePubQueue).toContainEqual(msg);
        expect(consoleErrorSpy).toHaveBeenCalledWith('[AMQP] publish error:', 'critical');
        consoleErrorSpy.mockRestore();
    });

    test('publish queues message when channel not ready', async () => {
        amqp.connect.mockRejectedValueOnce(new Error('conn fail'));
        const q = new Queue('testQueue');
        await new Promise(r => setTimeout(r, 10));
        const msg = { foo: 'offline' };
        await q.publish(msg);
        expect(q.offlinePubQueue).toContainEqual(msg);
    });

    test('connect sends pending messages from offline queue', async () => {
        amqp.connect.mockRejectedValueOnce(new Error('conn fail'));
        const q = new Queue('testQueue');
        await new Promise(r => setTimeout(r, 10));

        const msg = { foo: 'pending' };
        q.offlinePubQueue.push(msg);

        // Now mock success
        amqp.connect.mockResolvedValueOnce(mockConnection);
        const publishSpy = jest.spyOn(q, 'publish').mockResolvedValue();

        await q.connect();
        expect(publishSpy).toHaveBeenCalledWith(msg);
        expect(q.offlinePubQueue.length).toBe(0);
    });
});
