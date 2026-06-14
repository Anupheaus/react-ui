import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';

// Control the device the hook sees. Each test sets currentDevice before rendering.
let currentDevice: 'web' | 'tablet' | 'mobile' = 'web';
// NOTE: Mutating currentDevice after renderHook does NOT trigger a re-render
// because the vi.mock bypasses useSyncExternalStore's subscribe mechanism.
// Set currentDevice before calling renderHook.
vi.mock('../../theme/useDevice', () => ({
  useDevice: () => currentDevice,
}));

import { useWindow } from './useWindow';
import { createWindow } from './createWindow';
import { WindowsManager, WINDOWS_DEFAULT_ID, DIALOGS_DEFAULT_ID } from './WindowsManager';

const RoutingTestWindow = createWindow('RoutingTestWindow', () => () => null);

function createDefaultManagers() {
  WindowsManager.getOrCreate(WINDOWS_DEFAULT_ID, 'uw-test-windows', 'windows');
  WindowsManager.getOrCreate(DIALOGS_DEFAULT_ID, 'uw-test-dialogs', 'dialogs');
}

beforeEach(() => {
  currentDevice = 'web';
  WindowsManager.remove(WINDOWS_DEFAULT_ID);
  WindowsManager.remove(DIALOGS_DEFAULT_ID);
});

afterEach(() => {
  WindowsManager.remove(WINDOWS_DEFAULT_ID);
  WindowsManager.remove(DIALOGS_DEFAULT_ID);
});

describe('useWindow device routing', () => {
  it('opens into the windows manager on web', async () => {
    createDefaultManagers();
    const { result } = renderHook(() => useWindow(RoutingTestWindow));
    await act(async () => { await (result.current as any).openRoutingTestWindow('rt-web'); });
    expect(WindowsManager.get(WINDOWS_DEFAULT_ID).has('rt-web')).toBe(true);
    expect(WindowsManager.get(DIALOGS_DEFAULT_ID).has('rt-web')).toBe(false);
  });

  it('opens into the dialogs manager on mobile', async () => {
    createDefaultManagers();
    currentDevice = 'mobile';
    const { result } = renderHook(() => useWindow(RoutingTestWindow));
    await act(async () => { await (result.current as any).openRoutingTestWindow('rt-mobile'); });
    expect(WindowsManager.get(DIALOGS_DEFAULT_ID).has('rt-mobile')).toBe(true);
    expect(WindowsManager.get(WINDOWS_DEFAULT_ID).has('rt-mobile')).toBe(false);
  });

  it('opens into the windows manager on tablet', async () => {
    createDefaultManagers();
    currentDevice = 'tablet';
    const { result } = renderHook(() => useWindow(RoutingTestWindow));
    await act(async () => { await (result.current as any).openRoutingTestWindow('rt-tablet'); });
    expect(WindowsManager.get(WINDOWS_DEFAULT_ID).has('rt-tablet')).toBe(true);
    expect(WindowsManager.get(DIALOGS_DEFAULT_ID).has('rt-tablet')).toBe(false);
  });

  it('throws a clear error on mobile when no dialogs manager is mounted', async () => {
    WindowsManager.getOrCreate(WINDOWS_DEFAULT_ID, 'uw-test-windows', 'windows');
    currentDevice = 'mobile';
    const { result } = renderHook(() => useWindow(RoutingTestWindow));
    await expect((result.current as any).openRoutingTestWindow('rt-none'))
      .rejects.toThrow(/No default dialogs manager found/);
  });
});
