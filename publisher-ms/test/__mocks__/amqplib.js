let sentCount = 0;

const mockChannel = {
    assertQueue: jest.fn().mockResolvedValue({}),
    sendToQueue: jest.fn((q, c, o, cb) => {
        sentCount++;
        if (cb) cb(null, true);
        return true;
    }),
    on: jest.fn(),
    close: jest.fn().mockResolvedValue({}),
};

const mockConnection = {
    createConfirmChannel: jest.fn().mockResolvedValue(mockChannel),
    on: jest.fn(),
    close: jest.fn().mockResolvedValue({}),
};

module.exports = {
    connect: jest.fn().mockResolvedValue(mockConnection),
    sent: () => sentCount,
    resetSent: () => { sentCount = 0; }
};
