import type { QRCodeData } from './QRCodeModels';

export function encodeQRData(data: QRCodeData): string {
  switch (data.type) {
    case 'url':
    case 'text':
      return data.value;

    case 'object':
      return JSON.stringify(data.value);

    case 'email': {
      const { to, subject, body } = data.value;
      const params = [
        subject ? `subject=${encodeURIComponent(subject)}` : null,
        body    ? `body=${encodeURIComponent(body)}`       : null,
      ].filter(Boolean).join('&');
      return params ? `mailto:${to}?${params}` : `mailto:${to}`;
    }

    case 'phone':
      return `tel:${data.value}`;

    case 'sms': {
      const { to, message = '' } = data.value;
      return `smsto:${to}:${message}`;
    }

    case 'wifi': {
      const { ssid, password = '', security = 'none' } = data.value;
      return `WIFI:T:${security};S:${ssid};P:${password};;`;
    }

    case 'vcard': {
      const { name, phone, email, org, url, address } = data.value;
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${name}`,
        phone ? `TEL:${phone}` : null,
        email ? `EMAIL:${email}` : null,
        org ? `ORG:${org}` : null,
        url ? `URL:${url}` : null,
        address ? `ADR:${address}` : null,
        'END:VCARD',
      ].filter(Boolean) as string[];
      return lines.join('\r\n');
    }

    case 'geo': {
      const { lat, lng } = data.value;
      return `geo:${lat},${lng}`;
    }
  }
}
