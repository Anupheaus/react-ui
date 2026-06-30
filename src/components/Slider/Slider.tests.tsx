import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Slider } from './Slider';

describe('Slider', () => {
  it('renders without crashing for type single', () => {
    const { container } = render(<Slider type="single" value={50} />);
    expect(container.querySelector('input[type="range"]')).not.toBeNull();
  });

  it('renders without crashing for type range', () => {
    const { container } = render(<Slider type="range" value={{ min: 20, max: 80 }} />);
    expect(container.querySelector('input[type="range"]')).not.toBeNull();
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
    expect(container.querySelector('[class*="Slider-mark"]')).not.toBeNull();
  });

  it('does not render marks when showMarks is false', () => {
    const { container } = render(<Slider type="single" value={0} min={0} max={10} step={5} />);
    expect(container.querySelector('[class*="Slider-mark"]')).toBeNull();
  });

  it('clamps onChange value to clampMin for type single', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Slider type="single" value={60} min={0} max={100} clampMin={50} onChange={onChange} />
    );
    const input = container.querySelector('input[type="range"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '20' } });
    expect(onChange).toHaveBeenCalledWith(50);
  });

  it('clamps onChange value to clampMax for type single', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Slider type="single" value={60} min={0} max={100} clampMax={80} onChange={onChange} />
    );
    const input = container.querySelector('input[type="range"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '95' } });
    expect(onChange).toHaveBeenCalledWith(80);
  });

  it('renders the value label for showValue tooltip', () => {
    const { container } = render(<Slider type="single" value={50} showValue="tooltip" />);
    expect(container.querySelector('[class*="valueLabel"]')).not.toBeNull();
  });

  it('does not render the value label by default', () => {
    const { container } = render(<Slider type="single" value={50} />);
    expect(container.querySelector('[class*="valueLabel"]')).toBeNull();
  });

  it('hides the value label at rest for showValue active', () => {
    const { container } = render(<Slider type="single" value={50} showValue="active" />);
    expect(container.querySelector('[class*="valueLabel"]')).toBeNull();
  });

  it('shows the value label while the thumb is being dragged for showValue active', () => {
    const { container } = render(<Slider type="single" value={50} min={0} max={100} showValue="active" />);
    const root = container.querySelector('.MuiSlider-root') as HTMLElement;
    fireEvent.mouseDown(root, { clientX: 10, clientY: 0, buttons: 1 });
    expect(container.querySelector('[class*="valueLabel"]')).not.toBeNull();
  });

  it('hides the value label again once the drag ends for showValue active', () => {
    const { container } = render(<Slider type="single" value={50} min={0} max={100} showValue="active" />);
    const root = container.querySelector('.MuiSlider-root') as HTMLElement;
    fireEvent.mouseDown(root, { clientX: 10, clientY: 0, buttons: 1 });
    expect(container.querySelector('[class*="valueLabel"]')).not.toBeNull();
    fireEvent.mouseUp(root);
    expect(container.querySelector('[class*="valueLabel"]')).toBeNull();
  });

  it('renders a forbidden overlay when clampMin is set', () => {
    const { container } = render(
      <Slider type="single" value={60} min={0} max={100} clampMin={50} />
    );
    expect(container.querySelector('[data-testid="forbidden-overlay-min"]')).not.toBeNull();
  });

  it('does not render a forbidden overlay when neither clampMin nor clampMax is set', () => {
    const { container } = render(<Slider type="single" value={50} min={0} max={100} />);
    expect(container.querySelector('[data-testid="forbidden-overlay-min"]')).toBeNull();
    expect(container.querySelector('[data-testid="forbidden-overlay-max"]')).toBeNull();
  });

  it('does not render scale labels by default', () => {
    const { container } = render(<Slider type="single" value={50} min={0} max={100} />);
    expect(container.querySelector('[data-testid="scale-label-min"]')).toBeNull();
    expect(container.querySelector('[data-testid="scale-label-max"]')).toBeNull();
  });

  it('renders numeric scale labels when showScaleLabels is true', () => {
    const { getByTestId } = render(
      <Slider type="single" value={50} min={0} max={100} showScaleLabels />
    );
    expect(getByTestId('scale-label-min').textContent).toBe('0');
    expect(getByTestId('scale-label-max').textContent).toBe('100');
  });

  it('renders custom scale labels when minLabel and maxLabel are provided', () => {
    const { getByTestId } = render(
      <Slider
        type="single"
        value={50}
        min={0}
        max={100}
        showScaleLabels
        minLabel="$0"
        maxLabel="$100"
      />
    );
    expect(getByTestId('scale-label-min').textContent).toBe('$0');
    expect(getByTestId('scale-label-max').textContent).toBe('$100');
  });

  it('renders scale labels above and below the track for vertical orientation', () => {
    const { getByTestId } = render(
      <Slider type="single" value={50} min={0} max={100} orientation="vertical" showScaleLabels />
    );
    expect(getByTestId('scale-label-min').textContent).toBe('0');
    expect(getByTestId('scale-label-max').textContent).toBe('100');
  });
});
