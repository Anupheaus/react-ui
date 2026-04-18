import { renderHook } from '@testing-library/react';
import { useForm } from './useForm';

interface TestData {
  name: string;
  age: number;
}

describe('useForm', () => {
  it('Field component is returned and is defined', () => {
    const { result } = renderHook(() => useForm<TestData>({ data: { name: 'Alice', age: 30 } }));
    expect(result.current.Field).toBeDefined();
    expect(result.current.Field).not.toBeNull();
  });

  it('Form component is returned and is defined', () => {
    const { result } = renderHook(() => useForm<TestData>({ data: { name: 'Alice', age: 30 } }));
    expect(result.current.Form).toBeDefined();
    expect(result.current.Form).not.toBeNull();
  });

  it('useField is a function', () => {
    const { result } = renderHook(() => useForm<TestData>({ data: { name: 'Alice', age: 30 } }));
    expect(typeof result.current.useField).toBe('function');
  });

  it("useField('name') returns the field value and a setter", () => {
    const { result } = renderHook(() => {
      const form = useForm<TestData>({ data: { name: 'Alice', age: 30 } });
      return form.useField('name');
    });
    expect(result.current.name).toBe('Alice');
    expect(typeof result.current.setName).toBe('function');
    expect(result.current.Field).toBeDefined();
  });

  it('does not throw when data is undefined', () => {
    expect(() => {
      renderHook(() => useForm<TestData>({}));
    }).not.toThrow();
  });
});
