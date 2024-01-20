import { createLegacyStyles } from '../theme/createStyles';
import { Typography } from '@mui/material';
import { CSSProperties, ReactNode, useContext, useMemo } from 'react';
import { createComponent } from '../components/Component';
import { StorybookContext } from './StorybookContext';

interface Props {
  className?: string;
  title?: ReactNode;
  notes?: ReactNode;
  width?: string | number;
  height?: string | number;
  isVertical?: boolean;
  children?: ReactNode;
}
const useStyles = createLegacyStyles(() => ({
  styles: {
    storybookComponent: {
      display: 'flex',
      flex: 'auto',
      flexDirection: 'column',
    },
    title: {
      paddingBottom: 12,
    },
    notes: {
      paddingBottom: 12,
    },
    componentTestArea: {
      display: 'flex',
      flex: 'none',
      position: 'relative',
    },
    showBorder: {
      padding: 10,

      '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderStyle: 'dashed',
        borderWidth: '10px 0',
        borderImage: 'repeating-linear-gradient(90deg, #D0D7DC, #D0D7DC 10px, #7c8084 10px, #7c8084 20px) 1',
        pointerEvents: 'none',
      },

      '&:after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderStyle: 'solid',
        borderWidth: '0 10px',
        borderImage: 'repeating-linear-gradient(0deg, #D0D7DC, #D0D7DC 10px, #7c8084 10px, #7c8084 20px) 1',
        pointerEvents: 'none',
      }
    },
    isVertical: {
      flexDirection: 'column',
    },
  },
}));

export const StorybookComponent = createComponent('StorybookComponent', ({
  className,
  title,
  notes,
  width,
  height,
  isVertical = false,
  children = null,
}: Props) => {
  const { css, join } = useStyles();
  const { isTestBorderVisible } = useContext(StorybookContext);

  const style = useMemo<CSSProperties>(() => ({
    width: width ?? 'max-content',
    height,
  }), [width, height]);

  if (children == null) return null;

  return (
    <div className={css.storybookComponent}>
      {title != null && <Typography className={css.title} variant={'h5'}>{title}</Typography>}
      {notes != null && <Typography className={css.notes} variant={'body1'}>{notes}</Typography>}
      <div className={join(css.componentTestArea, isTestBorderVisible && css.showBorder, isVertical && css.isVertical, className)} style={style}>
        {children}
      </div>
    </div>
  );
});


// export const StorybookComponent = createComponent({
//   id: 'StorybookComponent',

//   styles: () => ({
//     styles: {
//       storybookComponent: {
//         display: 'flex',
//         flex: 'auto',
//         flexDirection: 'column',
//       },
//       title: {
//         paddingBottom: 12,
//       },
//       notes: {
//         paddingBottom: 12,
//       },
//       componentTestArea: {
//         display: 'flex',
//         flex: 'none',
//         position: 'relative',
//       },
//       showBorder: {
//         padding: 10,

//         '&:before': {
//           content: '""',
//           display: 'block',
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           borderStyle: 'dashed',
//           borderWidth: '10px 0',
//           borderImage: 'repeating-linear-gradient(90deg, #D0D7DC, #D0D7DC 10px, #7c8084 10px, #7c8084 20px) 1',
//           pointerEvents: 'none',
//         },

//         '&:after': {
//           content: '""',
//           display: 'block',
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           borderStyle: 'solid',
//           borderWidth: '0 10px',
//           borderImage: 'repeating-linear-gradient(0deg, #D0D7DC, #D0D7DC 10px, #7c8084 10px, #7c8084 20px) 1',
//           pointerEvents: 'none',
//         }
//       },
//       isVertical: {
//         flexDirection: 'column',
//       },
//     },
//   }),

//   render({
//     title,
//     notes,
//     width,
//     height,
//     isVertical = false,
//     children = null,
//   }: Props, { css, join }) {
//     const { isTestBorderVisible } = useContext(StorybookContext);

//     const style = useMemo<CSSProperties>(() => ({
//       width: width ?? 'max-content',
//       height,
//     }), [width, height]);

//     if (children == null) return null;

//     return (
//       <div className={css.storybookComponent}>
//         {title != null && <Typography className={css.title} variant={'h5'}>{title}</Typography>}
//         {notes != null && <Typography className={css.notes} variant={'body1'}>{notes}</Typography>}
//         <div className={join(css.componentTestArea, isTestBorderVisible && css.showBorder, isVertical && css.isVertical)} style={style}>
//           {children}
//         </div>
//       </div>
//     );
//   },
// });
