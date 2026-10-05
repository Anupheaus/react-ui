import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Switch } from '../Switch';
import { SettingRow } from './SettingRow';

const meta: Meta<typeof SettingRow> = {
  component: SettingRow,
};
export default meta;

type Story = StoryObj<typeof SettingRow>;

const LONG_DESCRIPTION = 'Sent to the customer as soon as their fitting is booked, moved or cancelled, with the new date, time and the address of the fitter who is coming, so nobody has to ring the office.';

function SwitchRow({ label, description }: { label: string; description: string }) {
  const [isOn, setIsOn] = useState(true);
  return (
    <SettingRow label={label} description={description}>
      <Switch value={isOn} onChange={setIsOn} />
    </SettingRow>
  );
}

export const Rows: Story = {
  render: () => (
    <div style={{ width: 480, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SwitchRow label="Deposit receipt" description="Sent when a deposit is paid." />
      <SwitchRow label="Fitting booked, moved or cancelled" description={LONG_DESCRIPTION} />
    </div>
  ),
};
