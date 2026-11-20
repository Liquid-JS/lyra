import { NbAuthResult } from '@liquid-js/lyr-auth';

describe('NbAuthResult.from', () => {
  it('should make the result the constructor would, from named options', () => {
    const result = NbAuthResult.from({
      success: false,
      response: { status: 401 },
      redirect: null,
      errors: ['Wrong email or password.', ''],
    });

    expect(result).toEqual(new NbAuthResult(false, { status: 401 }, null, ['Wrong email or password.', '']));
    expect(result.isFailure()).toBe(true);
    expect(result.getRedirect()).toBeUndefined();
    expect(result.getErrors()).toEqual(['Wrong email or password.']);
    expect(result.getMessages()).toEqual([]);
  });
});
