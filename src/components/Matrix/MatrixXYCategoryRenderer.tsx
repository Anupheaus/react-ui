import type { ReactUIComponent } from '../Component';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import type { MatrixXYCategory } from './MatrixModels';
import type { MatrixXYCategoryRendererProps } from './DefaultMatrixXYCategoryRenderer';
import { createStyles } from '../../theme';
// import { Icon } from '../Icon';
// import { useBound } from '../../hooks';

const useStyles = createStyles(({ fields: { content: { normal: { borderColor, backgroundColor } } } }, { applyTransition }) => ({
  matrixXYCategory: {
    position: 'relative',
  },
  matrixXYCategoryHandle: {
    position: 'absolute',
    opacity: 0,
    ...applyTransition('opacity'),

    '&:hover': {
      opacity: 1,
    },
  },
  matrixXCategoryHandle: {
    top: -27,
    left: -15,
    width: 22,
    paddingLeft: 2,
    height: 'calc(100% + 27px)',
  },
  matrixYCategoryHandle: {
    top: -15,
    left: -27,
    height: 22,
    paddingTop: 2,
    width: 'calc(100% + 27px)',
  },
  matrixXCategoryHandleLast: {
    left: 'unset',
    right: -15,
  },
  matrixYCategoryHandleLast: {
    top: 'unset',
    bottom: -15,
  },
  matrixXYCategoryHandleIcon: {
    border: `1px solid ${borderColor}`,
    borderRadius: '50%',
    backgroundColor,
    width: 18,
    height: 18,
    cursor: 'pointer',
  },
}));

interface Props<T> {
  location: 'x' | 'y';
  renderer: ReactUIComponent<(props: MatrixXYCategoryRendererProps<T>) => JSX.Element>;
  value: MatrixXYCategory<T>;
  isLast: boolean;
  onChange(category: MatrixXYCategory<T>): void;
  onInsertBefore?(category: MatrixXYCategory<T>): void;
  onInsertAfter?(category: MatrixXYCategory<T>): void;
}

export const MatrixXYCategoryRenderer = createComponent('MatrixXYCategoryRenderer', function <T = unknown>({
  renderer: Renderer,
  isLast,
  onInsertBefore,
  onInsertAfter,
  location,
  ...props
}: Props<T>) {
  const { css /*, join*/ } = useStyles();

  // const handleInsertCategory = useBound((event: React.MouseEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   onInsertBefore(props.value);
  // });

  // const handleAddCategory = useBound((event: React.MouseEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   onInsertAfter(props.value);
  // });


  return (
    <Flex tagName="matrix-xy-category" className={css.matrixXYCategory}>
      <Renderer {...props} location={location} />
      {/* <Flex tagName="matrix-xy-category-insert-category" className={join(css.matrixXYCategoryHandle, location === 'x' ? css.matrixXCategoryHandle : css.matrixYCategoryHandle)}>
        <Flex tagName="matrix-xy-category-insert-category-icon" disableGrow className={css.matrixXYCategoryHandleIcon} onClickCapture={handleInsertCategory}>
          <Icon name="add" size="small" />
        </Flex>
      </Flex>
      {isLast === true && (
        <Flex tagName="matrix-xy-category-insert-category" className={join(css.matrixXYCategoryHandle, location === 'x' ? css.matrixXCategoryHandle : css.matrixYCategoryHandle,
          location === 'x' ? css.matrixXCategoryHandleLast : css.matrixYCategoryHandleLast)}>
          <Flex tagName="matrix-xy-category-insert-category-icon" disableGrow className={css.matrixXYCategoryHandleIcon} onClickCapture={handleAddCategory}>
            <Icon name="add" size="small" />
          </Flex>
        </Flex>
      )} */}
    </Flex>
  );
});