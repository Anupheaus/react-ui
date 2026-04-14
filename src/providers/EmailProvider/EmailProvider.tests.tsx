import { createEmail } from './createEmail';

describe('createEmail', () => {
  it('returns a token with the given name and definition', () => {
    const definition = () => () => null;
    const token = createEmail('OrderEmail', definition as never);
    expect(token.name).toBe('OrderEmail');
    expect(token.definition).toBe(definition);
  });
});
