import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { encodeQRData } from './encodeQRData';
import { QRCode } from './QRCode';

vi.mock('qr-code-styling', () => {
  return {
    default: function () {
      return {
        append: vi.fn(),
        update: vi.fn(),
      };
    },
  };
});

describe('encodeQRData', () => {
  it('encodes url as-is', () => {
    expect(encodeQRData({ type: 'url', value: 'https://example.com' })).toBe('https://example.com');
  });

  it('encodes text as-is', () => {
    expect(encodeQRData({ type: 'text', value: 'hello world' })).toBe('hello world');
  });

  it('encodes object as JSON', () => {
    expect(encodeQRData({ type: 'object', value: { a: 1 } })).toBe('{"a":1}');
  });

  it('encodes email with all fields', () => {
    expect(encodeQRData({ type: 'email', value: { to: 'a@b.com', subject: 'Hi', body: 'Hello' } }))
      .toBe('mailto:a@b.com?subject=Hi&body=Hello');
  });

  it('encodes email with to only', () => {
    expect(encodeQRData({ type: 'email', value: { to: 'a@b.com' } })).toBe('mailto:a@b.com');
  });

  it('encodes phone', () => {
    expect(encodeQRData({ type: 'phone', value: '+441234567890' })).toBe('tel:+441234567890');
  });

  it('encodes sms with message', () => {
    expect(encodeQRData({ type: 'sms', value: { to: '+441234567890', message: 'Hey' } }))
      .toBe('smsto:+441234567890:Hey');
  });

  it('encodes sms without message', () => {
    expect(encodeQRData({ type: 'sms', value: { to: '+441234567890' } })).toBe('smsto:+441234567890:');
  });

  it('encodes wifi with WPA security', () => {
    expect(encodeQRData({ type: 'wifi', value: { ssid: 'MyNet', password: 'pass123', security: 'WPA' } }))
      .toBe('WIFI:T:WPA;S:MyNet;P:pass123;;');
  });

  it('encodes wifi with no security and no password', () => {
    expect(encodeQRData({ type: 'wifi', value: { ssid: 'OpenNet' } }))
      .toBe('WIFI:T:none;S:OpenNet;P:;;');
  });

  it('encodes vcard with all fields', () => {
    const result = encodeQRData({
      type: 'vcard',
      value: { name: 'John Doe', phone: '+441234567890', email: 'j@d.com', org: 'ACME', url: 'https://jd.com', address: '1 Main St' },
    });
    expect(result).toContain('BEGIN:VCARD');
    expect(result).toContain('VERSION:3.0');
    expect(result).toContain('FN:John Doe');
    expect(result).toContain('TEL:+441234567890');
    expect(result).toContain('EMAIL:j@d.com');
    expect(result).toContain('ORG:ACME');
    expect(result).toContain('URL:https://jd.com');
    expect(result).toContain('ADR:1 Main St');
    expect(result).toContain('END:VCARD');
  });

  it('encodes vcard with name only', () => {
    const result = encodeQRData({ type: 'vcard', value: { name: 'Jane' } });
    expect(result).toContain('FN:Jane');
    expect(result).not.toContain('TEL:');
  });

  it('encodes geo', () => {
    expect(encodeQRData({ type: 'geo', value: { lat: 51.5, lng: -0.12 } })).toBe('geo:51.5,-0.12');
  });

  it('percent-encodes email subject and body', () => {
    expect(encodeQRData({ type: 'email', value: { to: 'a@b.com', subject: 'Hello World', body: 'Hi & bye' } }))
      .toBe('mailto:a@b.com?subject=Hello%20World&body=Hi%20%26%20bye');
  });

  it('uses CRLF line endings in vcard output', () => {
    const result = encodeQRData({ type: 'vcard', value: { name: 'Jane' } });
    expect(result).toContain('\r\n');
  });
});

describe('QRCode component', () => {
  it('renders without crashing for type url', () => {
    const { container } = render(<QRCode type="url" value="https://example.com" />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders without crashing for type text', () => {
    const { container } = render(<QRCode type="text" value="hello" />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders without crashing for type email', () => {
    const { container } = render(<QRCode type="email" value={{ to: 'a@b.com' }} />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders without crashing for type phone', () => {
    const { container } = render(<QRCode type="phone" value="+441234567890" />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders without crashing for type sms', () => {
    const { container } = render(<QRCode type="sms" value={{ to: '+441234567890' }} />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders without crashing for type wifi', () => {
    const { container } = render(<QRCode type="wifi" value={{ ssid: 'MyNet' }} />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders without crashing for type vcard', () => {
    const { container } = render(<QRCode type="vcard" value={{ name: 'Jane' }} />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders without crashing for type geo', () => {
    const { container } = render(<QRCode type="geo" value={{ lat: 51.5, lng: -0.12 }} />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders without crashing for type object', () => {
    const { container } = render(<QRCode type="object" value={{ key: 'val' }} />);
    expect(container.firstChild).not.toBeNull();
  });

  it('applies a default size of 256', () => {
    const { container } = render(<QRCode type="url" value="https://example.com" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('256px');
    expect(el.style.height).toBe('256px');
  });

  it('applies a custom size', () => {
    const { container } = render(<QRCode type="url" value="https://example.com" size={128} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('128px');
    expect(el.style.height).toBe('128px');
  });

  it('renders an image logo overlay', () => {
    const { container } = render(
      <QRCode type="url" value="https://example.com" logo={{ type: 'image', src: 'https://example.com/logo.png' }} />
    );
    expect(container.querySelector('img')).not.toBeNull();
    expect(container.querySelector('img')?.getAttribute('src')).toBe('https://example.com/logo.png');
  });

  it('renders an icon logo overlay', () => {
    const { container } = render(
      <QRCode type="url" value="https://example.com" logo={{ type: 'icon', name: 'error' }} />
    );
    // Icon renders a tag with data-icon-type attribute
    expect(container.querySelector('[data-icon-type="error"]')).not.toBeNull();
  });

  it('does not render a logo when logo prop is omitted', () => {
    const { container } = render(<QRCode type="url" value="https://example.com" />);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('[data-icon-type]')).toBeNull();
  });
});
