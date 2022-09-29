import Color from 'color';

function lighten(color: string, percentage: number) {
  return Color(color).lighten(1 + (percentage / 100)).hex();
}

function darken(color: string, percentage: number) {
  return Color(color).darken(percentage / 100).hex();
}

export const colors = {
  lighten,
  darken,
};
