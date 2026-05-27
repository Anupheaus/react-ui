import { DateTime } from 'luxon';

export type GoogleAccountConnectionStatus = 'connected' | 'broken';

export type UserIntegrationId = 'google-calendar';

/** UI connection state for an integration row (includes disconnected). */
export type UserIntegrationConnectionStatus = 'disconnected' | GoogleAccountConnectionStatus;

export interface GoogleAccountProfile {
  email: string;
  name: string;
  picture?: string;
  connectedAt: string;
  status: GoogleAccountConnectionStatus;
}

export interface IntegrationRow {
  id: string;
  integration: string;
  account: string;
  connected: string;
  expires: string;
  connectionStatus: UserIntegrationConnectionStatus;
  integrationLabel: string;
}

export namespace UserIntegrationStoryData {
  export const googleCalendarId: UserIntegrationId = 'google-calendar';
  export const googleCalendarLabel = 'Google Calendar';

  export const connectedGoogleAccount: GoogleAccountProfile = {
    email: 'jane.doe@example.com',
    name: 'Jane Doe',
    connectedAt: '2026-05-20T10:34:00.000Z',
    status: 'connected',
  };

  export const brokenGoogleAccount: GoogleAccountProfile = {
    email: 'jane.doe@example.com',
    name: 'Jane Doe',
    connectedAt: '2026-04-01T09:15:00.000Z',
    status: 'broken',
  };

  export function getGoogleCalendarConnectionStatus(
    account?: GoogleAccountProfile,
  ): UserIntegrationConnectionStatus {
    if (account == null) return 'disconnected';
    return account.status;
  }

  export function formatConnectedSince(connectedAt?: string): string {
    if (connectedAt == null) return '—';
    const connected = DateTime.fromISO(connectedAt);
    if (!connected.isValid) return '—';
    return connected.toRelative() ?? connected.toLocaleString(DateTime.DATETIME_MED);
  }

  export function formatExpiresLabel(status: UserIntegrationConnectionStatus): string {
    switch (status) {
      case 'disconnected': return '—';
      case 'connected': return 'Auto-renews';
      case 'broken': return 'Access revoked';
    }
  }

  export function formatAccountLabel(account?: GoogleAccountProfile): string {
    return account?.email ?? '—';
  }

  export function buildIntegrationRows(account?: GoogleAccountProfile): IntegrationRow[] {
    const connectionStatus = getGoogleCalendarConnectionStatus(account);

    return [{
      id: googleCalendarId,
      integration: googleCalendarLabel,
      account: formatAccountLabel(account),
      connected: formatConnectedSince(account?.connectedAt),
      expires: formatExpiresLabel(connectionStatus),
      connectionStatus,
      integrationLabel: googleCalendarLabel,
    }];
  }
}
