import { render, screen } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createEmail } from './createEmail';
import { EmailProvider } from './EmailProvider';
import { useEmail } from './useEmail';

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

const TestEmail = createEmail('TestEmail', ({ Email, Body }) =>
  (name: string) => (
    <Email subject={`Hello ${name}`}>
      <Body>
        <p>Content for {name}</p>
      </Body>
    </Email>
  )
);

function makeWrapper(onSend: jest.Mock) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <EmailProvider onSend={onSend}>{children}</EmailProvider>;
  };
}

describe('useEmail', () => {
  it('renders the template to HTML and calls onSend', async () => {
    const onSend = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useEmail(TestEmail), { wrapper: makeWrapper(onSend) });

    await act(async () => {
      await result.current('World', { to: 'test@example.com' });
    });

    expect(onSend).toHaveBeenCalledTimes(1);
    const payload = onSend.mock.calls[0][0];
    expect(payload.html).toContain('Content for World');
    expect(payload.to).toBe('test@example.com');
  });

  it('uses the subject from the Email component', async () => {
    const onSend = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useEmail(TestEmail), { wrapper: makeWrapper(onSend) });

    await act(async () => {
      await result.current('Alice', { to: 'a@b.com' });
    });

    expect(onSend.mock.calls[0][0].subject).toBe('Hello Alice');
  });

  it('overrides subject with send-time subject when provided', async () => {
    const onSend = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useEmail(TestEmail), { wrapper: makeWrapper(onSend) });

    await act(async () => {
      await result.current('Alice', { to: 'a@b.com', subject: 'Override Subject' });
    });

    expect(onSend.mock.calls[0][0].subject).toBe('Override Subject');
  });

  it('passes all send-time props through to onSend', async () => {
    const onSend = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useEmail(TestEmail), { wrapper: makeWrapper(onSend) });

    await act(async () => {
      await result.current('Bob', {
        to: ['a@b.com', 'c@d.com'],
        cc: 'cc@b.com',
        bcc: 'bcc@b.com',
        from: 'sender@b.com',
        alias: 'Sender Name',
        replyTo: 'reply@b.com',
      });
    });

    expect(onSend).toHaveBeenCalledWith(expect.objectContaining({
      to: ['a@b.com', 'c@d.com'],
      cc: 'cc@b.com',
      bcc: 'bcc@b.com',
      from: 'sender@b.com',
      alias: 'Sender Name',
      replyTo: 'reply@b.com',
    }));
  });

  it('throws when email() is called outside EmailProvider', () => {
    const { result } = renderHook(() => useEmail(TestEmail));
    expect(() => result.current('Bob', { to: 'a@b.com' })).toThrow(
      'useEmail must be used within an <EmailProvider>'
    );
  });

  it('propagates onSend rejection to the caller', async () => {
    const error = new Error('send failed');
    const onSend = jest.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useEmail(TestEmail), { wrapper: makeWrapper(onSend) });
    await act(async () => {
      await expect(result.current('World', { to: 'a@b.com' })).rejects.toThrow('send failed');
    });
  });
});
