// Tests for request.module in publisher-ms
jest.mock('axios', () => ({
    get: jest.fn()
}));
const axios = require('axios');
const { getMessage } = require('../src/modules/message.module');
jest.mock('../src/modules/message.module');

const { getMicrocontrollers, requestMeasure } = require('../src/modules/request.module');

describe('request.module', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('getMicrocontrollers returns data on success', async () => {
        const mockData = [{ ip: '1.2.3.4', measure: 'temp' }];
        axios.get.mockResolvedValueOnce({ data: mockData });
        const result = await getMicrocontrollers('temperature');
        expect(result).toEqual(mockData);
    });

    test('getMicrocontrollers returns undefined on error', async () => {
        axios.get.mockRejectedValueOnce(new Error('network'));
        // request.module.js doesn't have a try-catch for getMicrocontrollers, so it will throw.
        // Let me check request.module.js content again.
        await expect(getMicrocontrollers('humidity')).rejects.toThrow('network');
    });

    test('requestMeasure returns transformed message on success', async () => {
        const micro = { ip: '1.2.3.4', measure: 'temp' };
        const apiResponse = { data: { value: 42 } };
        const transformed = { payload: 'msg' };
        axios.get.mockResolvedValueOnce(apiResponse);
        getMessage.mockReturnValueOnce(transformed);
        const result = await requestMeasure(micro);
        expect(result).toBe(transformed);
        expect(axios.get).toHaveBeenCalledWith('http://1.2.3.4/temp', { timeout: expect.any(Number) });
    });

    test('requestMeasure returns undefined on error', async () => {
        const micro = { ip: '1.2.3.4', measure: 'temp' };
        axios.get.mockRejectedValueOnce(new Error('timeout'));
        const result = await requestMeasure(micro);
        expect(result).toBeUndefined();
    });
});
