import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Slider } from './Slider';

describe('Slider', () => {
  it('renders without crashing for type single', () => {
    const { container } = render(<Slider type="single" value={50} />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders without crashing for type range', () => {
    const { container } = render(<Slider type="range" value={{ min: 20, max: 80 }} />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders a label when provided', () => {
    const { getByText } = render(<Slider type="single" label="Volume" value={50} />);
    expect(getByText('Volume')).not.toBeNull();
  });

  it('calls onChange with a number for type single', () => {
    const onChange = vi.fn();
    const { container } = render(<Slider type="single" value={0} min={0} max={100} onChange={onChange} />);
    const input = container.querySelector('input[type="range"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '42' } });
    expect(onChange).toHaveBeenCalledWith(42);
  });

  it('calls onChange with { min, max } for type range', () => {
    const onChange = vi.fn();
    const { container } = render(<Slider type="range" value={{ min: 10, max: 90 }} min={0} max={100} onChange={onChange} />);
    const inputs = container.querySelectorAll('input[type="range"]');
    fireEvent.change(inputs[0], { target: { value: '25' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ min: 25 }));
  });

  it('renders marks when showMarks is true', () => {
    const { container } = render(<Slider type="single" value={0} min={0} max={10} step={5} showMarks />);
    expect(container.querySelector('.MuiSlider-mark')).not.toBeNull();
  });

  it('does not render marks when showMarks is false', () => {
    const { container } = render(<Slider type="single" value={0} min={0} max={10} step={5} />);
    expect(container.querySelector('.MuiSlider-markActive')).toBeNull();
  });
});
