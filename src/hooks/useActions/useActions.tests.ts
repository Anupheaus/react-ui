import { renderHook } from '@testing-library/react';
import { useActions } from './useActions';

type TestActions = { greet(name: string): string };

// setActions calls useEffect internally so it must always be called unconditionally
// inside the hook callback (same hook call order on every render).
// We pass a stable actions object created once per test via a ref captured in the
// renderHook callback closure.

describe('useActions', () => {
  it('hasActions is false before setActions is called', () => {
    const { result } = renderHook(() => useActions<TestActions>());
    expect(result.current.hasActions).toBe(false);
  });

  it('hasActions is true after setActions is called', () => {
    const impl = { greet: (name: string) => `Hello ${name}` };
    const { result } = renderHook(() => {
      const actions = useActions<TestActions>();
      actions.setActions(impl);
      return actions;
    });
    expect(result.current.hasActions).toBe(true);
  });

  it('invokes the registered action', () => {
    const impl = { greet: (name: string) => `Hello ${name}` };
    const { result } = renderHook(() => {
      const actions = useActions<TestActions>();
      actions.setActions(impl);
      return actions;
    });
    expect(result.current.greet('World')).toBe('Hello World');
  });

  it('waitOnActions resolves immediately when actions are already set', async () => {
    const impl = { greet: () => '' };
    const { result } = renderHook(() => {
      const actions = useActions<TestActions>();
      actions.setActions(impl);
      return actions;
    });
    await expect(result.current.waitOnActions()).resolves.toBeUndefined();
  });

  it('waitOnActions rejects when actions are not set within timeout', async () => {
    const { result } = renderHook(() => useActions<TestActions>());
    await expect(result.current.waitOnActions(50)).rejects.toThrow();
  });

  it('getMappedActions hasActions is false before setMappedActions is called', () => {
    const { result } = renderHook(() => useActions<TestActions>());
    const mapped = result.current.getMappedActions('test-id');
    expect(mapped.hasActions).toBe(false);
  });

  it('getMappedActions hasActions is true after setMappedActions is called', () => {
    const { result } = renderHook(() => useActions<TestActions>());
    result.current.setMappedActions('test-id')({ greet: name => `Hi ${name}` });
    const mapped = result.current.getMappedActions('test-id');
    expect(mapped.hasActions).toBe(true);
  });

  it('invokes a mapped action', () => {
    const { result } = renderHook(() => useActions<TestActions>());
    result.current.setMappedActions('test-id')({ greet: name => `Hi ${name}` });
    const mapped = result.current.getMappedActions('test-id') as TestActions;
    expect(mapped.greet('Alice')).toBe('Hi Alice');
  });
});
