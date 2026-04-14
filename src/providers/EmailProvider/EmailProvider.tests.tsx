import { render, screen } from '@testing-library/react';
import { createEmail } from './createEmail';
import { EmailProvider } from './EmailProvider';

describe('createEmail', () => {
  it('returns a token with the given name and definition', () => {
    const definition = () => () => null;
    const token = createEmail('OrderEmail', definition as never);
    expect(token.name).toBe('OrderEmail');
    expect(token.definition).toBe(definition);
  });
});

describe('EmailProvider', () => {
  it('renders its children', () => {
    render(
      <EmailProvider onSend={jest.fn()}>
        <span>child content</span>
      </EmailProvider>
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });
});
