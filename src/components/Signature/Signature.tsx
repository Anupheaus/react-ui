import { useEffect, useRef } from 'react';
import SignaturePad from 'signature_pad';
import useResizeObserver from 'use-resize-observer';
import { createComponent } from '../Component';
import { createStyles } from '../../theme';
import { Field } from '../Field';
import type { FieldProps } from '../Field';
import { Button } from '../Button';
import { useBound } from '../../hooks';

export interface SignatureProps extends FieldProps {
  value?: string;
  allowClear?: boolean;
  onChange?(value: string | undefined): void;
}

const useStyles = createStyles(({ fields, signature }) => ({
  canvas: {
    display: 'block',
    flexGrow: 1,
    width: '100%',
    minHeight: 250,
    minWidth: 300,
    backgroundColor: signature?.backgroundColor ?? fields.content.normal.backgroundColor,
    color: signature?.penColor ?? fields.content.normal.textColor,
    cursor: 'crosshair',
  },
}));

export const Signature = createComponent('Signature', ({
  value,
  allowClear = false,
  onChange,
  ...fieldProps
}: SignatureProps) => {
  const { css } = useStyles();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const latestValueRef = useRef<string | undefined>(value);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Keep latest value ref in sync for use inside ResizeObserver callback
  latestValueRef.current = value;

  // Initialise signature_pad once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return;

    const pad = new SignaturePad(canvas, {
      penColor: getComputedStyle(canvas).color,
      backgroundColor: getComputedStyle(canvas).backgroundColor,
    });

    const onEndStroke = () => {
      onChangeRef.current?.(canvas.toDataURL('image/png'));
    };
    pad.addEventListener('endStroke', onEndStroke);

    padRef.current = pad;

    return () => {
      pad.removeEventListener('endStroke', onEndStroke);
      pad.off();
      padRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync external value changes into the pad
  useEffect(() => {
    const pad = padRef.current;
    if (pad == null) return;
    if (value) {
      pad.fromDataURL(value).catch(() => { /* invalid or corrupt data URL — ignore silently */ });
    } else {
      pad.clear();
    }
  }, [value]);

  // Redraw after resize (canvas clear is a native side-effect of resizing)
  const handleResize = useBound(() => {
    const canvas = canvasRef.current;
    const pad = padRef.current;
    if (canvas == null || pad == null) return;
    const savedValue = latestValueRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    if (savedValue) {
      pad.fromDataURL(savedValue).catch(() => { /* ignore — best-effort redraw after resize */ });
    }
  });

  useResizeObserver({ ref: canvasRef, onResize: handleResize });

  const handleClear = useBound(() => {
    padRef.current?.clear();
    onChangeRef.current?.(undefined);
  });

  return (
    <Field
      {...fieldProps}
      tagName="signature"
      fullHeight
      endAdornments={allowClear ? (
        <Button variant="hover" onClick={handleClear}>Clear</Button>
      ) : undefined}
    >
      <canvas ref={canvasRef} className={css.canvas} />
    </Field>
  );
});
