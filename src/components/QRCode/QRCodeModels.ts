import type { AnyObject } from '@anupheaus/common';

export type QRCodeData =
  | { type: 'url';    value: string }
  | { type: 'text';   value: string }
  | { type: 'object'; value: AnyObject }
  | { type: 'email';  value: { to: string; subject?: string; body?: string } }
  | { type: 'phone';  value: string }
  | { type: 'sms';    value: { to: string; message?: string } }
  | { type: 'wifi';   value: { ssid: string; password?: string; security?: 'WPA' | 'WEP' | 'none' } }
  | { type: 'vcard';  value: { name: string; phone?: string; email?: string; org?: string; url?: string; address?: string } }
  | { type: 'geo';    value: { lat: number; lng: number } }

export type QRCodeLogo =
  | { type: 'image'; src: string }
  | { type: 'icon';  name: string }

export interface QRCodeProps {
  logo?: QRCodeLogo;
  size?: number;
  className?: string;
}

export type Props = QRCodeData & QRCodeProps;
