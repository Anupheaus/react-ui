import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
  component: Slider,
};
export default meta;

type Story = StoryObj<typeof Slider>;

export const Single: Story = {
  args: { type: 'single', label: 'Volume', value: 40, min: 0, max: 100 },
  render: props => {
    const [value, setValue] = useState(props.type === 'single' ? (props.value as number) ?? 0 : 0);
    return <Slider {...props} type="single" value={value} onChange={setValue} width={240} />;
  },
};

export const Range: Story = {
  args: { type: 'range', label: 'Price range', value: { min: 20, max: 80 }, min: 0, max: 100 },
  render: props => {
    const [value, setValue] = useState<{ min: number; max: number }>(
      props.type === 'range' ? (props.value as { min: number; max: number }) ?? { min: 20, max: 80 } : { min: 20, max: 80 }
    );
    return <Slider {...props} type="range" value={value} onChange={setValue} width={240} />;
  },
};

export const ShowValueTooltip: Story = {
  args: { type: 'single', label: 'Opacity', value: 60, showValue: 'tooltip' },
  render: props => {
    const [value, setValue] = useState(60);
    return <Slider {...props} type="single" value={value} onChange={setValue} width={240} />;
  },
};

export const ShowValueInline: Story = {
  args: { type: 'single', label: 'Brightness', value: 75, showValue: 'inline' },
  render: props => {
    const [value, setValue] = useState(75);
    return <Slider {...props} type="single" value={value} onChange={setValue} width={240} />;
  },
};

export const WithMarks: Story = {
  args: { type: 'single', label: 'Step', value: 50, min: 0, max: 100, step: 10, showMarks: true },
  render: props => {
    const [value, setValue] = useState(50);
    return <Slider {...props} type="single" value={value} onChange={setValue} width={240} />;
  },
};

export const Vertical: Story = {
  args: { type: 'single', label: 'Level', value: 30, orientation: 'vertical', showValue: 'tooltip' },
  render: props => {
    const [value, setValue] = useState(30);
    return <div style={{ height: 200 }}><Slider {...props} type="single" value={value} onChange={setValue} /></div>;
  },
};

export const ReadOnly: Story = {
  args: { type: 'single', label: 'Read-only', value: 55 },
  render: props => (
    <Slider {...props} type="single" value={55} onChange={() => {}} width={240} />
  ),
  parameters: { uiState: { isReadOnly: true } },
};
