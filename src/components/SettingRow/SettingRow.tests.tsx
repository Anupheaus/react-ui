import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DefaultTheme, ThemeProvider } from '../../theme';
import { Switch } from '../Switch';
import { SettingRow } from './SettingRow';

function renderRow(onChange = vi.fn()) {
  render(
    <ThemeProvider theme={DefaultTheme}>
      <SettingRow label="Deposit receipt" description="Sent when a deposit is paid">
        <Switch value={false} onChange={onChange} />
      </SettingRow>
    </ThemeProvider>,
  );
  return onChange;
}

describe('SettingRow', () => {
  it('shows the name and the description, and names the control by them', async () => {
    renderRow();

    expect(await screen.findByText('Deposit receipt')).toBeInTheDocument();
    expect(screen.getByText('Sent when a deposit is paid')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Deposit receipt/ })).toBeInTheDocument();
  });

  it('operates the control when the name is clicked', async () => {
    const onChange = renderRow();

    fireEvent.click(await screen.findByText('Deposit receipt'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('operates the control once when the control itself is clicked', async () => {
    const onChange = renderRow();

    fireEvent.click(await screen.findByRole('checkbox'));

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
