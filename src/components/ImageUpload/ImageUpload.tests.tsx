import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { ImageUpload } from './ImageUpload';

describe('ImageUpload', () => {
  it('renders a Choose control and no image when there is no value', () => {
    const { queryByText } = render(<ImageUpload />);
    expect(queryByText('Choose')).not.toBeNull();
    expect(queryByText('Replace')).toBeNull();
  });

  it('renders the image and Replace/Remove when a value is provided', () => {
    const { container, queryByText } = render(<ImageUpload value="https://example.com/logo.png" />);
    expect(queryByText('Replace')).not.toBeNull();
    expect(queryByText('Remove')).not.toBeNull();
    // Image renders the src as a background-image
    const image = container.querySelector('image') as HTMLElement | null;
    expect(image).not.toBeNull();
    expect(image!.style.backgroundImage).toContain('https://example.com/logo.png');
  });

  it('uses the provided onUpload and emits its resolved URL on pick', async () => {
    const onUpload = vi.fn(async () => 'https://cdn.example.com/uploaded.png');
    const onChange = vi.fn();
    const { container, getByText } = render(<ImageUpload onUpload={onUpload} onChange={onChange} />);
    // Click Choose first: selectFile() arms the deferred promise that the input's change resolves.
    fireEvent.click(getByText('Choose'));
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['x'], 'logo.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => expect(onChange).toHaveBeenCalledWith('https://cdn.example.com/uploaded.png'));
    expect(onUpload).toHaveBeenCalledWith(file);
  });

  it('clears the value when Remove is clicked', () => {
    const onChange = vi.fn();
    const { getByText } = render(<ImageUpload value="https://example.com/logo.png" onChange={onChange} />);
    fireEvent.click(getByText('Remove'));
    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});
