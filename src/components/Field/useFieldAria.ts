import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useId } from '../../hooks';

/** The ids a field's label text and its error or help message carry, so the control can point at them. */
export interface FieldAriaIds {
  /** Set only when the field draws a label. */
  labelId?: string;
  /** Set only when the field shows an error or help message under it. */
  messageId?: string;
}

/** The attributes that tie a field's control to its label and message. Spread them onto the focusable control. */
export interface FieldAriaControlProps {
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
}

interface Props {
  label?: ReactNode;
  error?: ReactNode;
  assistiveHelp?: ReactNode;
}

interface FieldAria {
  ids: FieldAriaIds;
  controlProps: FieldAriaControlProps;
}

/** A label of `null`, `false` or `''` draws no text for a screen reader to read. */
export function hasFieldLabel(label: ReactNode): boolean {
  return label != null && label !== false && label !== '';
}

/** An error always shows; help shows unless it is `false` (the field's way of switching its help line off) or empty. */
export function hasFieldMessage({ error, assistiveHelp }: Pick<Props, 'error' | 'assistiveHelp'>): boolean {
  if (error != null) return true;
  return assistiveHelp != null && assistiveHelp !== false && assistiveHelp !== '';
}

/**
 * Works out the ids a field's label and message need and the attributes its control needs to use them. A component that
 * renders its own control inside a `Field` calls this, spreads `controlProps` onto the control and passes `ids` to the
 * `Field` as `ariaIds`.
 */
export function useFieldAria({ label, error, assistiveHelp }: Props): FieldAria {
  const labelId = useId();
  const messageId = useId();
  const hasLabel = hasFieldLabel(label);
  const hasMessage = hasFieldMessage({ error, assistiveHelp });
  const isInvalid = error != null;

  return useMemo<FieldAria>(() => ({
    ids: {
      labelId: hasLabel ? labelId : undefined,
      messageId: hasMessage ? messageId : undefined,
    },
    controlProps: {
      'aria-labelledby': hasLabel ? labelId : undefined,
      'aria-describedby': hasMessage ? messageId : undefined,
      'aria-invalid': isInvalid ? true : undefined,
    },
  }), [hasLabel, hasMessage, isInvalid, labelId, messageId]);
}
