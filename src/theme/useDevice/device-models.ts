/**
 * The kind of device a component is being rendered on, as far as styling and behaviour are concerned.
 * - `web`    — a regular desktop / fine-pointer environment.
 * - `tablet` — any coarse-pointer (touch) device.
 * - `mobile` — a coarse-pointer device with a narrow viewport (a phone-sized touch device).
 *
 * A real phone satisfies both the tablet and mobile conditions; `mobile` is the more specific answer.
 */
export type DeviceType = 'web' | 'tablet' | 'mobile';
