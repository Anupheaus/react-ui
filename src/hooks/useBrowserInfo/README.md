# useBrowserInfo

Detects and returns information about the current browser and device, including browser name, version, platform, and whether the device has a touch screen.

## Signature

```ts
function useBrowserInfo(): BrowserInfo
```

## Parameters

No parameters.

## Returns

| Property | Type | Description |
|----------|------|-------------|
| `isTouchScreen` | `boolean` | Whether the primary input is a coarse pointer (touch device). |
| `browserName` | `string` | Detected browser name (e.g. `"Chrome"`, `"Safari"`, `"Firefox"`, `"Microsoft Edge"`). |
| `fullVersion` | `string` | Full version string of the detected browser. |
| `majorVersion` | `number` | Major version number of the detected browser. |
| `appName` | `string` | `navigator.appName` value. |
| `userAgent` | `string` | Raw `navigator.userAgent` string. |
| `platform` | `string` | `navigator.platform` value. |

## Usage

```tsx
import { useBrowserInfo } from '@anupheaus/react-ui';

function App() {
  const { browserName, majorVersion, isTouchScreen } = useBrowserInfo();

  return (
    <div>
      Running on {browserName} v{majorVersion}
      {isTouchScreen && ' (touch screen)'}
    </div>
  );
}
```

---

[← Back to Hooks](../README.md)
