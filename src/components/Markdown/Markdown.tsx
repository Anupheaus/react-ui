import MDEditor from '@uiw/react-md-editor';
import Color from 'color';
import { useEffect, useRef, useState } from 'react';
import { createAnimationKeyFrame, createStyles } from '../../theme';
import { createComponent } from '../Component';
import { useBound } from '../../hooks';
import type { FieldProps } from '../Field';
import { Field } from '../Field';
import { useUIState, useValidation } from '../../providers';

const scrollPromptAnimation = createAnimationKeyFrame({
  '0%': { opacity: '0', transform: 'translateY(0)' },
  '15%': { opacity: '1', transform: 'translateY(0)' },
  '25%': { opacity: '1', transform: 'translateY(-6px)' },
  '35%': { opacity: '1', transform: 'translateY(0)' },
  '45%': { opacity: '1', transform: 'translateY(-6px)' },
  '55%': { opacity: '1', transform: 'translateY(0)' },
  '65%': { opacity: '1', transform: 'translateY(-6px)' },
  '75%': { opacity: '1', transform: 'translateY(0)' },
  '90%': { opacity: '0', transform: 'translateY(0)' },
  '100%': { opacity: '0', transform: 'translateY(0)' },
});

const useStyles = createStyles(({ scrollbars: { thumb, track }, text, shadows, markdown }, { applyTransition }) => {
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
    wrapper: {
      position: 'relative',
      display: 'flex',
      flex: 'auto',
      flexDirection: 'column',
      width: '100%',
    },
    editor: {
      width: '100%',
      flex: 1,
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
    shadow: {
      position: 'absolute',
      opacity: 0,
      pointerEvents: 'none',
      ...applyTransition('opacity'),
      zIndex: 1,
      left: -2,
      right: -2,
      height: 2,

      '&.is-visible': {
        opacity: 1,
      },
    },
    shadowTop: {
      top: -2,
      boxShadow: shadows.scroll(false),
    },
    shadowBottom: {
      bottom: -2,
      boxShadow: shadows.scroll(false),
    },
    scrollPrompt: {
      position: 'absolute',
      bottom: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
      alignItems: 'center',
      opacity: 0,
      animationName: scrollPromptAnimation,
      animationDuration: '3s',
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
      animationFillMode: 'both',
    },
    scrollPromptArrow: {
      position: 'relative',
      width: 20,
      height: 8,

      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        width: 14,
        height: 3,
        borderRadius: 2,
        backgroundColor: markdown.scrollPromptColor,
      },
      '&::before': {
        left: 0,
        transform: 'rotate(45deg)',
        transformOrigin: 'left bottom',
      },
      '&::after': {
        right: 0,
        transform: 'rotate(-45deg)',
        transformOrigin: 'right bottom',
      },
    },
  };
});

interface Props extends FieldProps {
  value?: string;
  onChange?(value: string): void;
  onScrolledToBottom?(): void;
  showScrollPrompt?: boolean;
  fullHeight?: boolean;
}

export const Markdown = createComponent('Markdown', ({
  value,
  onChange,
  onScrolledToBottom,
  showScrollPrompt,
  fullHeight,
  error: propsError,
  ...fieldProps
}: Props) => {
  const { css, join, theme } = useStyles();
  const { isReadOnly } = useUIState();
  const { validate } = useValidation({ forceEnable: showScrollPrompt });
  const colorMode = Color(theme.fields.content.normal.backgroundColor ?? '#fff').isDark() ? 'dark' : 'light';
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shadowAtTop, setShadowAtTop] = useState(false);
  const [shadowAtBottom, setShadowAtBottom] = useState(false);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);

  const { error } = validate(() => {
    console.log('Validating markdown being called', { showScrollPrompt, hasReachedBottom }); // eslint-disable-line no-console
    if (showScrollPrompt && !hasReachedBottom) return 'Please scroll to the bottom to confirm you have read all the content';
  });

  const hasReachedBottomRef = useRef(false);

  const handleChange = useBound((newValue?: string) => onChange?.(newValue ?? ''));

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (wrapper == null) return;

    const scrollContainer = wrapper.querySelector<HTMLElement>('.w-md-editor-preview');
    if (scrollContainer == null) return;

    const content = scrollContainer.querySelector<HTMLElement>('.wmde-markdown') ?? scrollContainer;
    content.style.position = 'relative';

    const topSentinel = document.createElement('div');
    topSentinel.style.cssText = 'position:absolute;top:0;left:0;right:0;height:1px;pointer-events:none;';
    const bottomSentinel = document.createElement('div');
    bottomSentinel.style.cssText = 'position:absolute;bottom:0;left:0;right:0;height:1px;pointer-events:none;';

    content.insertBefore(topSentinel, content.firstChild);
    content.appendChild(bottomSentinel);

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === topSentinel) setShadowAtTop(!entry.isIntersecting);
        if (entry.target === bottomSentinel) {
          setShadowAtBottom(!entry.isIntersecting);
          if (entry.isIntersecting) {
            if (!hasReachedBottomRef.current) {
              hasReachedBottomRef.current = true;
              onScrolledToBottom?.();
            }
            setHasReachedBottom(true);
          }
        }
      });
    }, { root: scrollContainer, threshold: 0 });

    observer.observe(topSentinel);
    observer.observe(bottomSentinel);

    return () => {
      observer.disconnect();
      topSentinel.remove();
      bottomSentinel.remove();
      setShadowAtTop(false);
      setShadowAtBottom(false);
    };
  }, [isReadOnly]);

  return (
    <Field {...fieldProps} tagName="markdown" fullHeight={fullHeight} error={propsError ?? error}>
      <div ref={wrapperRef} className={css.wrapper}>
        <MDEditor
          className={css.editor}
          value={value}
          onChange={handleChange}
          hideToolbar
          visibleDragbar={false}
          preview={isReadOnly ? 'preview' : 'live'}
          data-color-mode={colorMode}
        />
        <div className={join(css.shadow, css.shadowTop, shadowAtTop && 'is-visible')} />
        <div className={join(css.shadow, css.shadowBottom, shadowAtBottom && 'is-visible')} />
        {showScrollPrompt && !hasReachedBottom && (
          <div className={css.scrollPrompt}>
            <div className={css.scrollPromptArrow} />
            <div className={css.scrollPromptArrow} />
          </div>
        )}
      </div>
    </Field>
  );
});
