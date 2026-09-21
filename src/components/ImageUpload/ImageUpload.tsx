import { useMemo } from 'react';
import type { MouseEvent } from 'react';
import { createComponent } from '../Component';
import { createStyles } from '../../theme';
import { Flex } from '../Flex';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Label } from '../Label';
import { useBound, useBooleanState } from '../../hooks';
import { useFileUploader } from '../../hooks/useFileUploader';
import { useNotifications } from '../Notifications';
import { useUIState } from '../../providers';
import { fileToDataUrl } from './fileToDataUrl';

const DEFAULT_FILE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
// Red used for the destructive clear-image control.
const DELETE_ICON_COLOR = '#dc2626';

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
  /** Caption rendered above the image frame. */
  label?: string;
  /** Class applied to the outer field wrapper. */
  className?: string;
  /** Frame width in pixels. */
  width?: number;
  /** Frame height in pixels. */
  height?: number;
  /** Frame background for previewing logos designed for a light or dark surface. */
  previewBackground?: 'light' | 'dark';
}

const useStyles = createStyles({
  imageUploadField: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  imageUpload: {
    position: 'relative',
    borderRadius: 8,
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  readOnly: {
    cursor: 'default',
  },
  previewLight: { backgroundColor: '#ffffff' },
  previewDark: { backgroundColor: '#1f2937' },
  image: {
    // A real <img> (not a CSS background) so URLs containing parentheses/spaces render — an
    // unquoted `background-image: url(...)` is invalid CSS for such URLs and paints nothing.
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    opacity: 0.55,
  },
  placeholderText: {
    fontSize: 13,
    justifyContent: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});

export const ImageUpload = createComponent('ImageUpload', ({
  value,
  onChange,
  onUpload,
  fileTypes = DEFAULT_FILE_TYPES,
  maxSizeBytes,
  label,
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
  const hasValue = value != null && value.length > 0;
  const hasLabel = label != null && label.length > 0;

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

  // Button stops propagation before invoking this, so clearing never also opens the picker.
  const handleRemove = useBound((_event: MouseEvent) => {
    if (isReadOnly) return;
    onChange?.(undefined);
  });

  return (
    <Flex tagName="image-upload-field" isVertical className={join(css.imageUploadField, className)} disableGrow>
      {hasLabel && <Label>{label}</Label>}
      <Flex
        tagName="image-upload"
        className={join(css.imageUpload, previewBackground === 'dark' ? css.previewDark : css.previewLight, isReadOnly && css.readOnly)}
        style={frameStyle}
        disableGrow
        onClick={handleChoose}
        testId="image-upload"
        aria-label={hasLabel ? `${label} image upload` : 'Image upload'}
      >
        {hasValue
          ? <img className={css.image} src={value} alt={hasLabel ? label : 'Uploaded image'} />
          : (
            <Flex tagName="image-upload-placeholder" isVertical className={css.placeholder} disableGrow>
              <Icon name="add" size="large" />
              <Flex tagName="image-upload-placeholder-text" className={css.placeholderText} disableGrow>Add Image</Flex>
            </Flex>
          )}
        {hasValue && !isReadOnly && (
          <Button className={css.deleteButton} iconOnly onClick={handleRemove} aria-label="Remove image">
            <Icon name="delete-list-item" color={DELETE_ICON_COLOR} size="small" />
          </Button>
        )}
      </Flex>
      <FileUploader fileTypes={fileTypes} />
    </Flex>
  );
});
