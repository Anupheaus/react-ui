import { describe, it, expect } from 'vitest';
import { encodeQRData } from './encodeQRData';

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
});
