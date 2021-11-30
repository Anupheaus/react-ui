import { makeStyles, CSSProperties, DefaultTheme, Styles, WithStylesOptions, ClassNameMap } from '@material-ui/styles';
import { is } from 'anux-common';

const join = (...names: (string | boolean | undefined | null)[]) => {
  const validNames = names.filter(is.not.empty).cast<string>();
  if (validNames.length === 0) { return undefined; }
  return validNames.join(' ');
};

const createStyle = <T extends CSSProperties>(style: T): T => style;

const flexAuto = createStyle({
  display: 'flex',
  flex: 'auto',
});

const flexNone = createStyle({
  display: 'flex',
  flex: 'none',
});

interface PositionAbsoluteProps { top?: number; left?: number; right?: number; bottom?: number; }
const positionAbsolute = ({ top = 0, left = 0, right = 0, bottom = 0 }: PositionAbsoluteProps = {}) => createStyle({
  position: 'absolute',
  top,
  left,
  right,
  bottom,
});

type UseStylesApi<ClassKey extends string> = ClassNameMap<ClassKey> & { join: typeof join; };

function make<Theme = DefaultTheme, Props extends object = {}, ClassKey extends string = string>(styles: Styles<Theme, Props, ClassKey>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: Omit<WithStylesOptions<Theme>, 'withTheme'>): keyof Props extends never ? (props?: any) => UseStylesApi<ClassKey> : (props: Props) => UseStylesApi<ClassKey> {
  const returnValue = makeStyles(styles, options);
  return (props: Props) => ({ ...returnValue(props), join });
}

export const styles = {
  make,
  flexAuto,
  flexNone,
  positionAbsolute,
};
