import { useMemo } from 'react';
import { createComponent } from '../Component';
import { createStyles } from '../../theme';
import { Flex } from '../Flex';
import { Image } from '../Image';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { useBound, useBooleanState } from '../../hooks';
import { useFileUploader } from '../../hooks/useFileUploader';
import { useNotifications } from '../Notifications';
import { useUIState } from '../../providers';
import { fileToDataUrl } from './fileToDataUrl';

const DEFAULT_FILE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

export interface ImageUploadProps {
  /** Current image source — a hosted URL or a data: URL. */
  value?: string;
  /** Emits the new source, or `undefined` when the image is removed. */
  onChange?(value: string | undefined): void;
  /** Resolves a picked file to a stored URL. Defaults to a base64 data: URL. */
  onUpload?(file: File): Promise<string>;
  /** Accepted MIME types / extensions for the picker. */
  fileTypes?: string[];
  /** Optional client-side size guard, in bytes. */
  maxSizeBytes?: number;
  label?: string;
  className?: string;
  width?: number;
  height?: number;
  /** Frame background for previewing logos designed for a light or dark surface. */
  previewBackground?: 'light' | 'dark';
}

const useStyles = createStyles({
  imageUpload: {
    position: 'relative',
    borderRadius: 8,
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewLight: { backgroundColor: '#ffffff' },
  previewDark: { backgroundColor: '#1f2937' },
  image: {
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  placeholder: {
    opacity: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    gap: 4,
  },
});

export const ImageUpload = createComponent('ImageUpload', ({
  value,
  onChange,
  onUpload,
  fileTypes = DEFAULT_FILE_TYPES,
  maxSizeBytes,
  className,
  width = 160,
  height = 90,
  previewBackground = 'light',
}: ImageUploadProps) => {
  const { css, join, useInlineStyle } = useStyles();
  const { isReadOnly } = useUIState();
  const { showError } = useNotifications();
  const { selectFile, FileUploader } = useFileUploader();
  const [isUploading, startUploading, stopUploading] = useBooleanState();

  const frameStyle = useInlineStyle(() => ({ width, height }), [width, height]);

  const resolver = useMemo(() => onUpload ?? fileToDataUrl, [onUpload]);

  const handleChoose = useBound(async () => {
    if (isReadOnly || isUploading) return;
    const files = await selectFile();
    const file = files[0];
    if (file == null) return;
    if (maxSizeBytes != null && file.size > maxSizeBytes) {
      showError(`That image is too large. Please choose a file under ${Math.round(maxSizeBytes / 1024)} KB.`);
      return;
    }
    startUploading();
    try {
      const url = await resolver(file);
      onChange?.(url);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload the image. Please try again.';
      showError(message);
    } finally {
      stopUploading();
    }
  });

  const handleRemove = useBound(() => {
    if (isReadOnly) return;
    onChange?.(undefined);
  });

  return (
    <Flex
      tagName="image-upload"
      isVertical={false}
      className={join(css.imageUpload, previewBackground === 'dark' ? css.previewDark : css.previewLight, className)}
      style={frameStyle}
      disableGrow
    >
      {value != null && value.length > 0
        ? <Image src={value} className={css.image} />
        : <Flex tagName="image-upload-placeholder" className={css.placeholder}><Icon name="no-image" size="large" /></Flex>}
      <FileUploader fileTypes={fileTypes} />
      <Flex tagName="image-upload-controls" className={css.controls} disableGrow>
        <Button variant="bordered" onClick={handleChoose}>{value != null && value.length > 0 ? 'Replace' : 'Choose'}</Button>
        {value != null && value.length > 0 && <Button variant="bordered" onClick={handleRemove}>Remove</Button>}
      </Flex>
    </Flex>
  );
});
