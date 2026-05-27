import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useEffect, useMemo } from 'react';
import { FiLink, FiRefreshCw } from 'react-icons/fi';
import { MdLinkOff } from 'react-icons/md';
import { createStory } from '../../Storybook/createStory';
import { Button } from '../Button';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import { UIState } from '../../providers';
import { createStyles } from '../../theme';
import { useActions, useBound } from '../../hooks';
import type { TableActions } from './Table';
import { Table } from './Table';
import type { TableColumn, TableOnRequest } from './TableModels';
import { TableRowActionColumn } from './TableRowActionColumn';
import type { GoogleAccountProfile, IntegrationRow, UserIntegrationConnectionStatus } from './userIntegrationsTableStoryData';
import { UserIntegrationStoryData } from './userIntegrationsTableStoryData';

const StoryIcon = Icon.augmentWith({
  'attach-appointment': FiLink,
  'detach-appointment': MdLinkOff,
  'sync': FiRefreshCw,
});

const useStatusIconStyles = createStyles({
  statusIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    borderRadius: '50%',
  },
  connected: {
    backgroundColor: '#2eaa50',
    color: '#ffffff',
  },
  disconnected: {
    backgroundColor: '#c0c0c0',
    color: '#ffffff',
  },
  broken: {
    backgroundColor: '#d64545',
    color: '#ffffff',
  },
});

const IntegrationStatusIcon = createComponent('IntegrationStatusIcon', ({ status }: { status: UserIntegrationConnectionStatus }) => {
  const { css, join } = useStatusIconStyles();

  if (status === 'connected') {
    return (
      <Flex tagName="integration-status-connected" className={join(css.statusIcon, css.connected)} alignCentrally>
        <Icon name="tick" size="small" />
      </Flex>
    );
  }

  if (status === 'broken') {
    return (
      <Flex tagName="integration-status-broken" className={join(css.statusIcon, css.broken)} alignCentrally>
        <Icon name="cross" size="small" />
      </Flex>
    );
  }

  return (
    <Flex tagName="integration-status-disconnected" className={join(css.statusIcon, css.disconnected)} alignCentrally />
  );
});

interface IntegrationRowActionsProps {
  connectionStatus: UserIntegrationConnectionStatus;
}

const IntegrationRowActions = createComponent('IntegrationRowActions', ({ connectionStatus }: IntegrationRowActionsProps) => {
  const connect = useBound(async () => {
    // Story stub — mirrors Vision connect/reconnect handlers.
  });

  const disconnect = useBound(async () => {
    // Story stub — mirrors Vision disconnect handler.
  });

  if (connectionStatus === 'disconnected') {
    return (
      <Tooltip content="Connect">
        <Button variant="hover" size="small" iconOnly onSelect={connect} aria-label="Connect">
          <StoryIcon name="attach-appointment" size="small" />
        </Button>
      </Tooltip>
    );
  }

  if (connectionStatus === 'broken') {
    return (
      <Tooltip content="Reconnect">
        <Button variant="hover" size="small" iconOnly onSelect={connect} aria-label="Reconnect">
          <StoryIcon name="sync" size="small" />
        </Button>
      </Tooltip>
    );
  }

  return (
    <Tooltip content="Disconnect">
      <Button variant="hover" size="small" iconOnly onSelect={disconnect} aria-label="Disconnect">
        <StoryIcon name="detach-appointment" size="small" />
      </Button>
    </Tooltip>
  );
});

const useTableStyles = createStyles({
  table: {
    flex: '1 1 0',
    minHeight: 0,
    minWidth: 0,
  },
});

interface UserIntegrationsTableStoryProps {
  googleAccount?: GoogleAccountProfile;
}

const UserIntegrationsTableStory = createComponent('UserIntegrationsTableStory', ({ googleAccount }: UserIntegrationsTableStoryProps) => {
  const { css } = useTableStyles();
  const { setActions, refresh } = useActions<TableActions>();

  const rows = useMemo(
    () => UserIntegrationStoryData.buildIntegrationRows(googleAccount),
    [googleAccount],
  );

  const columns = useMemo((): TableColumn<IntegrationRow>[] => [
    {
      id: 'status',
      field: 'id',
      label: 'Status',
      width: 60,
      alignment: 'center',
      renderValue: ({ record }) => record != null
        ? <IntegrationStatusIcon status={record.connectionStatus} />
        : null,
    },
    {
      id: 'integration',
      field: 'integration',
      label: 'Integration',
      width: 180,
      isResizable: true,
      renderValue: ({ record }) => record?.integration,
    },
    {
      id: 'account',
      field: 'account',
      label: 'Account',
      width: 220,
      isResizable: true,
      renderValue: ({ record }) => record?.account,
    },
    {
      id: 'connected',
      field: 'connected',
      label: 'Connected',
      width: 140,
      isResizable: true,
      renderValue: ({ record }) => record?.connected,
    },
    {
      id: 'expires',
      field: 'expires',
      label: 'Expires',
      width: 120,
      isResizable: true,
      renderValue: ({ record }) => record?.expires,
    },
    {
      id: 'table-actions',
      field: 'id',
      label: '',
      alignment: 'center',
      renderValue: props => props.record != null
        ? (
          <TableRowActionColumn {...props}>
            <IntegrationRowActions connectionStatus={props.record.connectionStatus} />
          </TableRowActionColumn>
        )
        : null,
    },
  ], []);

  useEffect(() => { refresh(); }, [rows, refresh]);

  const onRequest = useBound<TableOnRequest<IntegrationRow>>(async ({ requestId, pagination: { offset = 0, limit } }, respond) => {
    respond({ requestId, records: rows.slice(offset, offset + limit), total: rows.length });
  });

  return (
    <Flex tagName="user-integrations-table" isVertical maxHeight wide disableOverflow minWidth={0}>
      <UIState>
        <Table<IntegrationRow>
          className={css.table}
          columns={columns}
          actions={setActions}
          hideRecordCount
          unitName="integration"
          onRequest={onRequest}
          persistenceKey="user-integrations-table"
        />
      </UIState>
    </Flex>
  );
});

const meta: Meta<typeof UserIntegrationsTableStory> = {
  component: UserIntegrationsTableStory,
  title: 'Components/Table/User Integrations',
  argTypes: {
    googleAccount: {
      control: 'select',
      options: ['connected', 'disconnected', 'broken'],
      mapping: {
        connected: UserIntegrationStoryData.connectedGoogleAccount,
        disconnected: undefined,
        broken: UserIntegrationStoryData.brokenGoogleAccount,
      },
    },
  },
  args: {
    googleAccount: UserIntegrationStoryData.connectedGoogleAccount,
  },
};

export default meta;

type Story = StoryObj<typeof UserIntegrationsTableStory>;

/** Mirrors Vision `UserIntegrationsTable` columns, layout, persistence key, and mock Google Calendar row data. */
export const Connected: Story = createStory({
  width: 900,
  height: 320,
  render: ({ googleAccount }: UserIntegrationsTableStoryProps) => (
    <Flex tagName="user-integrations-tab" isVertical maxHeight wide disableOverflow minWidth={0}>
      <UserIntegrationsTableStory googleAccount={googleAccount} />
    </Flex>
  ),
});

export const Disconnected: Story = createStory({
  width: 900,
  height: 320,
  render: () => (
    <Flex tagName="user-integrations-tab" isVertical maxHeight wide disableOverflow minWidth={0}>
      <UserIntegrationsTableStory />
    </Flex>
  ),
});

export const Broken: Story = createStory({
  width: 900,
  height: 320,
  render: () => (
    <Flex tagName="user-integrations-tab" isVertical maxHeight wide disableOverflow minWidth={0}>
      <UserIntegrationsTableStory googleAccount={UserIntegrationStoryData.brokenGoogleAccount} />
    </Flex>
  ),
});
