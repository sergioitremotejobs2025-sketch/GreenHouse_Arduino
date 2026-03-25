describe('jwt config branch coverage', () => {
    beforeEach(() => {
        jest.resetModules();
        process.env.JWT_SECRET = 'env_secret';
    });

    it('should use JWT_SECRET from process.env if available', () => {
        const config = require('../src/config/jwt.config');
        expect(config.TOKEN_SECRET).toBe('env_secret');
    });

    it('should use default token_secret if JWT_SECRET is not available', () => {
        delete process.env.JWT_SECRET;
        const config = require('../src/config/jwt.config');
        expect(config.TOKEN_SECRET).toBe('token_secret');
    });
});
