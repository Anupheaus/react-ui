import { render } from '@testing-library/react';
import type { ReactListItem } from '../../models';
import { DefaultTheme, ThemeProvider, mergeThemes } from '../../theme';
import { DropDown } from './DropDown';

// A field owns its colours. It draws its own light background, so it must set its own text colour too rather than
// inheriting one from wherever it is placed: in a dark window header, which sets white text, a DropDown used to show
// its value white on its light field (sc-702).

const VERSIONS: ReactListItem[] = [{ id: 'current', text: 'Current · from 1 Jan 2026' }];
const FIELD_TEXT_COLOUR = 'rgb(51, 51, 51)';
const WHITE_TEXT = { color: 'rgb(255, 255, 255)' };
const THEME = mergeThemes(DefaultTheme, { text: { color: FIELD_TEXT_COLOUR } });

describe('DropDown — colours', () => {
  it('shows its value in the theme text colour when placed on white text', () => {
    const { container } = render(
      <ThemeProvider theme={THEME}>
        <div className="dark-header" style={WHITE_TEXT}>
          <DropDown values={VERSIONS} value="current" />
        </div>
      </ThemeProvider>,
    );

    const fieldBox = container.querySelector('dropdown-container') as HTMLElement;
    expect(getComputedStyle(fieldBox).color).toBe(FIELD_TEXT_COLOUR);
  });
});
