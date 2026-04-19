import { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { createComponent } from '../Component';
import { createStyles } from '../../theme';
import { Icon } from '../Icon';
import type { LocalIconDefinitions } from '../Icon/Icons';
import { encodeQRData } from './encodeQRData';
import type { Props, QRCodeData } from './QRCodeModels';

const useStyles = createStyles(() => ({
  container: {
    position: 'relative',
    display: 'inline-flex',
    flexShrink: 0,
  },
  qrMount: {
    display: 'flex',
  },
  logoOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
}));

export const QRCode = createComponent('QRCode', ({
  logo,
  size = 256,
  className,
  ...dataProps
}: Props) => {
  const { css, theme, join, useInlineStyle } = useStyles();
  // Dedicated mount point for qr-code-styling — separate from the React-managed container.
  const qrMountRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const encoded = encodeQRData(dataProps as QRCodeData);
  const qrTheme = theme.qrCode ?? {};
  const logoSize = Math.round(size * 0.2);

  const containerStyle = useInlineStyle(() => ({
    width: `${size}px`,
    height: `${size}px`,
  }), [size]);

  const logoOverlayStyle = useInlineStyle(() => ({
    width: `${logoSize}px`,
    height: `${logoSize}px`,
  }), [logoSize]);

  useEffect(() => {
    if (qrMountRef.current == null) return;
    qrRef.current = new QRCodeStyling({
      width: size,
      height: size,
      data: encoded,
      dotsOptions: {
        color: qrTheme.foregroundColor ?? '#000000',
        type: qrTheme.dotStyle ?? 'square',
      },
      cornersSquareOptions: {
        type: qrTheme.cornerSquareStyle === 'none' ? undefined : (qrTheme.cornerSquareStyle ?? 'square'),
      },
      cornersDotOptions: {
        type: qrTheme.cornerDotStyle === 'none' ? undefined : (qrTheme.cornerDotStyle ?? 'square'),
      },
      backgroundOptions: {
        color: qrTheme.backgroundColor ?? '#ffffff',
      },
    });
    qrRef.current.append(qrMountRef.current);
    return () => {
      if (qrMountRef.current != null) qrMountRef.current.innerHTML = '';
      qrRef.current = null;
    };
  }, []); // intentional: only run on mount

  useEffect(() => {
    qrRef.current?.update({
      width: size,
      height: size,
      data: encoded,
      dotsOptions: {
        color: qrTheme.foregroundColor ?? '#000000',
        type: qrTheme.dotStyle ?? 'square',
      },
      cornersSquareOptions: {
        type: qrTheme.cornerSquareStyle === 'none' ? undefined : (qrTheme.cornerSquareStyle ?? 'square'),
      },
      cornersDotOptions: {
        type: qrTheme.cornerDotStyle === 'none' ? undefined : (qrTheme.cornerDotStyle ?? 'square'),
      },
      backgroundOptions: {
        color: qrTheme.backgroundColor ?? '#ffffff',
      },
    });
  }, [encoded, size, qrTheme.foregroundColor, qrTheme.backgroundColor, qrTheme.dotStyle, qrTheme.cornerSquareStyle, qrTheme.cornerDotStyle]);

  return (
    <div className={join(css.container, className)} style={containerStyle}>
      <div ref={qrMountRef} className={css.qrMount} />
      {logo != null && (
        <div className={css.logoOverlay} style={logoOverlayStyle}>
          {logo.type === 'image' && (
            <img src={logo.src} className={css.logoImage} alt="" />
          )}
          {logo.type === 'icon' && (
            <Icon name={logo.name as keyof typeof LocalIconDefinitions} size={logoSize} />
          )}
        </div>
      )}
    </div>
  );
});
