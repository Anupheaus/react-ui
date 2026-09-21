import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { ImageUpload } from './ImageUpload';

describe('ImageUpload', () => {
  it('shows an Add Image placeholder with a plus icon and no image when there is no value', () => {
    const { queryByText, container } = render(<ImageUpload />);
    expect(queryByText('Add Image')).not.toBeNull();
    expect(container.querySelector('[data-icon-type="add"]')).not.toBeNull();
    expect(container.querySelector('img')).toBeNull();
  });

  it('renders an img with the value as its src when a value is provided', () => {
    // A real <img> (not a CSS background) so URLs with parentheses/spaces render.
    const url = 'https://ik.imagekit.io/x/Logo%20(Right).png';
    const { container } = render(<ImageUpload value={url} />);
    const image = container.querySelector('img') as HTMLImageElement | null;
    expect(image).not.toBeNull();
    expect(image!.getAttribute('src')).toBe(url);
    // The Add Image placeholder is not shown once there is a value.
    expect(container.querySelector('[data-icon-type="add"]')).toBeNull();
  });

  it('opens the picker when the frame is clicked and emits the resolved URL', async () => {
    const onUpload = vi.fn(async () => 'https://cdn.example.com/uploaded.png');
    const onChange = vi.fn();
    const { container } = render(<ImageUpload onUpload={onUpload} onChange={onChange} />);
    // Clicking anywhere on the frame opens the browse dialog (arms selectFile's deferred promise).
    fireEvent.click(container.querySelector('image-upload') as HTMLElement);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['x'], 'logo.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => expect(onChange).toHaveBeenCalledWith('https://cdn.example.com/uploaded.png'));
    expect(onUpload).toHaveBeenCalledWith(file);
  });

  it('clears the value when the trash button is clicked', () => {
    const onChange = vi.fn();
    const { getByLabelText } = render(<ImageUpload value="https://example.com/logo.png" onChange={onChange} />);
    fireEvent.click(getByLabelText('Remove image'));
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('does not show a trash button when there is no value', () => {
    const { queryByLabelText } = render(<ImageUpload />);
    expect(queryByLabelText('Remove image')).toBeNull();
  });

  it('renders the label as a caption when provided', () => {
    const { queryByText } = render(<ImageUpload label="My Logo" />);
    expect(queryByText('My Logo')).not.toBeNull();
  });

  it('renders no stray caption when no label is provided', () => {
    const { container } = render(<ImageUpload />);
    expect(container.querySelector('label')).toBeNull();
  });

  it('renders a help affordance beside the label when helpText is provided', () => {
    const { container } = render(<ImageUpload label="Light logo" helpText="A light foreground logo." />);
    expect(container.querySelector('[data-icon-type="help"]')).not.toBeNull();
  });
});
