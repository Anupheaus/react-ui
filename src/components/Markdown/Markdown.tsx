import MDEditor from '@uiw/react-md-editor';
import Color from 'color';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { useBound } from '../../hooks';
import type { FieldProps } from '../Field';
import { Field } from '../Field';
import { useUIState } from '../../providers';

const useStyles = createStyles(({ scrollbars: { thumb, track }, text, fields: { content } }, { applyTransition }) => {
  const scrollbars = {
    overflow: 'overlay' as const,
    '--scrollbar-thumb-color': 'transparent' as unknown as undefined,
    ...applyTransition('--scrollbar-thumb-color'),

    '&:hover': {
      '--scrollbar-thumb-color': (thumb.normal.backgroundColor ?? 'rgba(0 0 0 / 10%)') as unknown as undefined,
    },

    '@media(pointer: coarse)': {
      '--scrollbar-thumb-color': (thumb.normal.backgroundColor ?? 'rgba(0 0 0 / 10%)') as unknown as undefined,
    },

    '&::-webkit-scrollbar': {
      ...track.normal,
      padding: 0,
    },
    '&::-webkit-scrollbar-track': {
      ...track.normal,
      padding: 0,
    },
    '&::-webkit-scrollbar-corner': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: 8,
      minHeight: 40,
      ...thumb.normal,
      backgroundColor: 'var(--scrollbar-thumb-color)',
      boxShadow: 'none',
      border: 'solid 0px transparent',
      borderWidth: track.normal.padding ?? 4,
      backgroundClip: 'padding-box',
    },
  };

  return {
    editor: {
      '--md-editor-box-shadow-color': 'transparent' as unknown as undefined,
      '--md-editor-background-color': 'transparent' as unknown as undefined,
      '--color-canvas-default': 'transparent' as unknown as undefined,
      '--color-fg-default': text.color as unknown as undefined,
      '--md-editor-font-family': `'${text.family}', sans-serif` as unknown as undefined,

      '& .w-md-editor-text': {
        fontFamily: `'${text.family}', sans-serif`,
        fontSize: text.size,
        color: text.color,
      },

      '& .w-md-editor-area, & .w-md-editor-content, & .w-md-editor-preview': {
        ...scrollbars,
      },
    },
  };
});

interface Props extends FieldProps {
  value?: string;
  onChange?(value: string): void;
}

export const Markdown = createComponent('Markdown', ({
  value,
  onChange,
  ...fieldProps
}: Props) => {
  const { css, theme } = useStyles();
  const { isReadOnly } = useUIState();
  const colorMode = Color(theme.fields.content.normal.backgroundColor ?? '#fff').isDark() ? 'dark' : 'light';

  const handleChange = useBound((newValue?: string) => onChange?.(newValue ?? ''));

  return (
    <Field {...fieldProps} tagName="markdown">
      <MDEditor
        className={css.editor}
        value={value}
        onChange={handleChange}
        hideToolbar
        visibleDragbar={false}
        preview={isReadOnly ? 'preview' : 'live'}
        data-color-mode={colorMode}
      />
    </Field>
  );
});
