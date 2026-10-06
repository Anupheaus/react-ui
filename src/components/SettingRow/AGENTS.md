# SettingRow

One setting in a settings screen: the name with its description underneath on the left, the control on the right, vertically centred to the text block. Stack rows in a column and every control lines up on the right. The row is a native `label`, so the name is tied to the control: clicking the name or description operates the control, and assistive technology reads the text as the control's name.

Use it with a `Switch` that has **no `label` of its own** (the row supplies it). Long descriptions wrap inside the row and never push the control out of view.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `ReactNode` | Yes | The setting's name (medium weight) |
| `description` | `ReactNode` | No | Plain words under the name saying what the setting does |
| `children` | `ReactNode` | Yes | The control, shown on the right |
| `className` | `string` | No | Additional class on the row |

## Usage

```tsx
import { SettingRow, Switch } from '@anupheaus/react-ui';

<SettingRow label="Deposit receipt" description="Sent when a deposit is paid.">
  <Switch value={isOn} onChange={setIsOn} />
</SettingRow>
```

---

[← Back to Components](../AGENTS.md)
