import TokenProvider from '../../src/token.provider.js';

describe('TokenProvider', () => {
  const tokenProvider = new TokenProvider();

  describe('generate', () => {
    it('format', () => {
      expect(tokenProvider.generate()).toMatch(/^[\w-]{43}$/);
    });

    it('uniqueness', () => {
      expect(tokenProvider.generate()).not.toBe(tokenProvider.generate());
    });
  });

  it('hash', () => {
    expect(tokenProvider.hash('token-1')).toBe(
      '3f08aace122ee2368432c1ca23a049bc640bafbf00fdf33a52429f38ba12dbf9',
    );
  });
});
