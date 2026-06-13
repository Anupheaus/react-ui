import type { Preview } from '@storybook/react-webpack5';
import { StorybookDeviceDecorator } from '../src/Storybook/StorybookDeviceDecorator';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    device: {
      description: 'Render the component as though it is on this device type',
      defaultValue: 'auto',
      toolbar: {
        title: 'Device',
        icon: 'mobile',
        items: [
          { value: 'auto', title: 'Auto (story default)' },
          { value: 'web', title: 'Web' },
          { value: 'tablet', title: 'Tablet' },
          { value: 'mobile', title: 'Mobile' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [StorybookDeviceDecorator],
};

export default preview;
