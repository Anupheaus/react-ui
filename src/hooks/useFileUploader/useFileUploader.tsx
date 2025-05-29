import type { ChangeEvent } from 'react';
import { useMemo, useRef } from 'react';
import { createComponent } from '../../components/Component';
import { useBound } from '../useBound';
import { createStyles } from '../../theme';
import type { DeferredPromise } from '@anupheaus/common';

const useStyles = createStyles({
  fileInput: {
    display: 'none',
  },
});

interface Props {
  allowMultiple?: boolean;
  fileTypes?: string[];
}

export function useFileUploader() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const promiseRef = useRef<DeferredPromise<File[]>>();

  const onFileUpload = useBound((event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    promiseRef.current?.resolve(Array.from(files));
  });

  const onFileAbort = useBound(() => {
    promiseRef.current?.resolve([]);
  });

  const FileUploader = useMemo(() => createComponent('FileUploader', ({ allowMultiple = false, fileTypes = [] }: Props) => {
    const { css } = useStyles();

    const saveFileInputElement = useBound((element: HTMLInputElement | null) => {
      fileInputRef.current = element;
      if (!element) return;
      element.addEventListener('cancel', onFileAbort);
    });

    return (
      <input
        ref={saveFileInputElement}
        type="file"
        multiple={allowMultiple}
        accept={fileTypes.join(',')}
        aria-label="file-upload"
        className={css.fileInput}
        onChange={onFileUpload}
      />
    );
  }), []);

  const selectFile = useBound(async () => {
    promiseRef.current = Promise.createDeferred();
    fileInputRef.current?.click();
    return promiseRef.current;
  });

  return { selectFile, FileUploader };
}


