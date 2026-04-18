import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { QRCode } from './QRCode';

const meta: Meta<typeof QRCode> = {
  component: QRCode,
  title: 'Components/QRCode',
};
export default meta;

type Story = StoryObj<typeof QRCode>;

export const URL: Story = {
  render: () => <QRCode type="url" value="https://example.com" />,
};
URL.name = 'URL';

export const Text: Story = {
  render: () => <QRCode type="text" value="Hello, world!" />,
};
Text.name = 'Text';

export const ObjectData: Story = {
  render: () => <QRCode type="object" value={{ name: 'John', age: 30 }} />,
};
ObjectData.name = 'Object';

export const Email: Story = {
  render: () => <QRCode type="email" value={{ to: 'hello@example.com', subject: 'Hi', body: 'Hello there' }} />,
};
Email.name = 'Email';

export const Phone: Story = {
  render: () => <QRCode type="phone" value="+441234567890" />,
};
Phone.name = 'Phone';

export const SMS: Story = {
  render: () => <QRCode type="sms" value={{ to: '+441234567890', message: 'Hello!' }} />,
};
SMS.name = 'SMS';

export const WiFi: Story = {
  render: () => <QRCode type="wifi" value={{ ssid: 'MyNetwork', password: 'secret123', security: 'WPA' }} />,
};
WiFi.name = 'WiFi';

export const VCard: Story = {
  render: () => (
    <QRCode
      type="vcard"
      value={{ name: 'John Doe', phone: '+441234567890', email: 'john@example.com', org: 'ACME Ltd' }}
    />
  ),
};
VCard.name = 'vCard';

export const Geo: Story = {
  render: () => <QRCode type="geo" value={{ lat: 51.5074, lng: -0.1278 }} />,
};
Geo.name = 'Geo';

export const WithImageLogo: Story = {
  render: () => (
    <QRCode
      type="url"
      value="https://example.com"
      logo={{ type: 'image', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png' }}
    />
  ),
};
WithImageLogo.name = 'With Image Logo';

export const WithIconLogo: Story = {
  render: () => (
    <QRCode
      type="url"
      value="https://example.com"
      logo={{ type: 'icon', name: 'help' }}
    />
  ),
};
WithIconLogo.name = 'With Icon Logo';

export const Small: Story = {
  render: () => <QRCode type="url" value="https://example.com" size={128} />,
};
Small.name = 'Size 128';

export const Large: Story = {
  render: () => <QRCode type="url" value="https://example.com" size={512} />,
};
Large.name = 'Size 512';
