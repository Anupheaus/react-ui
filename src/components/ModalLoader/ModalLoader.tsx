import type { AnimationEvent } from 'react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { createComponent } from '../Component';
import type { ModalLoaderContextType } from './ModalLoaderContext';
import { ModalLoaderContext } from './ModalLoaderContext';
import { Flex } from '../Flex';
import { createAnimationKeyFrame, createStyles } from '../../theme';
import { useBound, useOnUnmount } from '../../hooks';
import { Icon } from '../Icon';
import { Busy } from '../Busy';

const slideIn = createAnimationKeyFrame({
  from: {
    opacity: 0,
    transform: 'translateY(-50px)',
  },
  to: {
    opacity: 0.8,
    transform: 'translateY(0)',
  },
});

const slideOut = createAnimationKeyFrame({
  from: {
    opacity: 0.8,
    transform: 'translateY(0)',
  },
  to: {
    opacity: 0,
    transform: 'translateY(50px)',
  },
});

const useStyles = createStyles(({ windows: { window } }, { applyTransition }) => ({
  overlay: {
    width: '100%',
    height: '100%',
    pointerEvents: 'all',
    filter: 'blur(0px)',
    ...applyTransition('filter'),

    '&.is-visible': {
      filter: 'blur(2px) brightness(0.8)',
      pointerEvents: 'none',
    },
  },
  modalContainer: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: 300,
    height: 120,
    opacity: 0,
    transform: 'translateY(-50px)',
    padding: '16px 24px',
    borderRadius: 8,
    backgroundColor: window.active.backgroundColor ?? 'rgba(0 0 0 / 0.2)',
    boxShadow: '0 2px 4px rgba(0 0 0 / 0.4)',
    fontSize: 14,
    fontWeight: 'bold',
    animationName: slideIn,
    animationDuration: '0.5s',
    animationIterationCount: 1,
    animationFillMode: 'forwards',
    pointerEvents: 'none',

    '&.is-finished': {
      animationName: slideOut,
    },
  },
  modalLoaderItemStatus: {
    width: 16,
    height: 20,
    overflow: 'hidden',
  },
  modalLoaderItemStatusIcon: {
    marginTop: 1,
  },
}));

interface StatusItem {
  message: ReactNode;
  addedAt: number;
  status: 'loading' | 'success' | 'error';
}

interface Props {
  hidingDelay?: number;
  children: ReactNode;
}

export const ModalLoader = createComponent('ModalLoader', ({
  children,
  hidingDelay = 500,
}: Props) => {
  const { css, join } = useStyles();
  const [statuses, setStatuses] = useState<Record<string, StatusItem>>({});
  const [isVisible, setIsVisible] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const isUnmounted = useOnUnmount();

  const context = useMemo<ModalLoaderContextType>(() => ({
    showLoadingOf: (id: string, message: ReactNode) => {
      setTimeout(() => {
        if (isUnmounted()) return;
        setStatuses(prev => ({ ...prev, [id]: { addedAt: Date.now(), ...(prev?.[id] as Partial<StatusItem>), message, status: 'loading' } }));
        setIsVisible(true);
      }, 0);
    },
    hideLoadingOf: (id: string) => {
      setTimeout(() => {
        if (isUnmounted()) return;
        setStatuses(prev => ({ ...prev, [id]: { ...prev[id], status: 'success' } }));
      }, hidingDelay);
    },
  }), []);

  const handleAnimationEnd = useBound((event: AnimationEvent) => {
    if (event.animationName === slideOut.name) setIsVisible(false);
  });

  const loader = useMemo(() => !isVisible ? null : (
    <Flex tagName="modal-loader-container" isVertical className={css.modalContainer}>
      <Flex tagName="modal-loader-dialog" isVertical className={join(css.modal, isFinished && 'is-finished')} onAnimationEnd={handleAnimationEnd} disableGrow valign="center">
        {Object.entries(statuses).orderBy(([_, { addedAt }]) => addedAt).map(([id, { message, status }]) => (
          <Flex tagName="modal-loader-item" key={id} disableGrow align="left" width="max-content" gap="fields">
            <Flex tagName="modal-loader-item-status" className={css.modalLoaderItemStatus}>
              {status === 'loading' ? <Busy variant="circular" size="small" /> : <Icon name={status === 'success' ? 'tick' : 'error'} size="small" className={css.modalLoaderItemStatusIcon} />}
            </Flex>
            {message}
          </Flex>
        ))}
      </Flex>
    </Flex>
  ), [statuses, isFinished, isVisible]);

  useEffect(() => {
    setIsFinished(!Object.values<StatusItem>(statuses).some(({ status }) => status !== 'success'));
  }, [statuses]);

  return (
    <ModalLoaderContext.Provider value={context}>
      <Flex tagName="modal-loader" isVertical className={join(css.overlay, !isFinished && 'is-visible')}>
        {children}
      </Flex>
      {loader}
    </ModalLoaderContext.Provider>
  );
});
