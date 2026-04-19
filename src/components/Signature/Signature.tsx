import { useEffect, useRef, useState } from 'react';
import type { PointerEvent, ReactNode } from 'react';
import SignaturePad from 'signature_pad';
import useResizeObserver from 'use-resize-observer';
import { createComponent } from '../Component';
import { createStyles } from '../../theme';
import { Field } from '../Field';
import type { FieldProps } from '../Field';
import { Button } from '../Button';
import { Tag } from '../Tag';
import { useBound } from '../../hooks';
import { useValidation } from '../../providers';

export interface SignatureProps extends FieldProps {
  value?: string;
  allowClear?: boolean;
  minStrokes?: number;
  minStrokesMessage?: ReactNode;
  onChange?(value: string | undefined): void;
}

const DELIBERATE_TAP_THRESHOLD_PX = 10;

const useStyles = createStyles(({ fields, signature }) => ({
  canvasContainer: {
    position: 'relative',
    flexGrow: 1,
    display: 'flex',
    minHeight: 250,
    minWidth: 300,
  },
  canvas: {
    display: 'block',
    flexGrow: 1,
    width: '100%',
    backgroundColor: signature?.backgroundColor ?? fields.content.normal.backgroundColor,
    color: signature?.penColor ?? fields.content.normal.textColor,
    cursor: 'crosshair',
  },
  clearButtonWrapper: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    touchAction: 'none',
    userSelect: 'none',
  },
}));

export const Signature = createComponent('Signature', ({
  value,
  allowClear = false,
  minStrokes,
  minStrokesMessage,
  onChange,
  ...fieldProps
}: SignatureProps) => {
  const { css } = useStyles();
  const { validate } = useValidation({ id: `Signature-${fieldProps.label}` });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [strokeCount, setStrokeCount] = useState(0);
  const strokeCountRef = useRef(0);
  // Tracks whether the latest value change came from the user drawing (true) or an external prop update (false).
  // When true we skip fromDataURL — the canvas already has the correct content and calling fromDataURL would
  // re-draw the captured PNG at a scaled size (÷ devicePixelRatio), producing smaller ghost copies.
  const isInternalChangeRef = useRef(false);
  // Tracks pointer-down position for deliberate-tap detection on the clear button.
  const clearPointerStartRef = useRef<{ x: number; y: number } | null>(null);

  // Initialise signature_pad once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return;

    // Size the canvas correctly before pad init so the first getBoundingClientRect ratio is accurate.
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d')?.scale(ratio, ratio);

    const pad = new SignaturePad(canvas, {
      penColor: getComputedStyle(canvas).color,
      backgroundColor: getComputedStyle(canvas).backgroundColor,
    });

    const onEndStroke = () => {
      isInternalChangeRef.current = true;
      strokeCountRef.current = pad.toData().length;
      setStrokeCount(strokeCountRef.current);
      enableErrorsRef.current();
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

  // Sync external value changes into the pad (skip when the change was triggered by the user drawing)
  useEffect(() => {
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }
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
    const savedData = pad.toData();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d')?.scale(ratio, ratio);
    pad.fromData(savedData);
  });

  useResizeObserver({ ref: canvasRef, onResize: handleResize });

  const { error, enableErrors } = validate(() => {
    if (minStrokes == null || strokeCount >= minStrokes) return;
    return minStrokesMessage ?? `Please provide at least ${minStrokes} stroke${minStrokes === 1 ? '' : 's'}`;
  });
  const enableErrorsRef = useRef(enableErrors);
  enableErrorsRef.current = enableErrors;

  const handleClear = useBound(() => {
    padRef.current?.clear();
    strokeCountRef.current = 0;
    setStrokeCount(0);
    onChangeRef.current?.(undefined);
  });

  // Deliberate-tap: record pointer-down position; only fire clear on pointer-up if movement
  // stayed within DELIBERATE_TAP_THRESHOLD_PX. This prevents a stray finger sliding across
  // the button from triggering a clear.
  const handleClearPointerDown = useBound((event: PointerEvent<HTMLDivElement>) => {
    clearPointerStartRef.current = { x: event.clientX, y: event.clientY };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    event.stopPropagation();
  });

  const handleClearPointerUp = useBound((event: PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const start = clearPointerStartRef.current;
    clearPointerStartRef.current = null;
    if (start == null) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.sqrt(dx * dx + dy * dy) < DELIBERATE_TAP_THRESHOLD_PX) {
      handleClear();
    }
  });

  const handleClearPointerCancel = useBound(() => {
    clearPointerStartRef.current = null;
  });

  return (
    <Field
      {...fieldProps}
      tagName="signature"
      fullHeight
      error={error}
    >
      <Tag name="signature-canvas-container" className={css.canvasContainer}>
        <canvas ref={canvasRef} className={css.canvas} />
        {allowClear && (
          <Tag
            name="signature-clear-button-wrapper"
            className={css.clearButtonWrapper}
            onPointerDown={handleClearPointerDown}
            onPointerUp={handleClearPointerUp}
            onPointerCancel={handleClearPointerCancel}
          >
            <Button>Clear</Button>
          </Tag>
        )}
      </Tag>
    </Field>
  );
});
