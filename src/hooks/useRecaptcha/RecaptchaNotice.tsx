import { createComponent } from '../../components/Component';
import { Typography } from '../../components/Typography';
import { createLegacyStyles } from '../../theme';

const useStyles = createLegacyStyles({
  recaptchaLegalText: {
    backgroundColor: 'rgba(0 0 0 / 5%)',
    padding: 4,
    borderRadius: 8,
    opacity: 0.7,
  },
});

export const RecaptchaNotice = createComponent('RecaptchaNotice', () => {
  const { css } = useStyles();
  return (
    <Typography className={css.recaptchaLegalText}>
      This widget is protected by reCAPTCHA and the Google&nbsp;
      <a href="https://policies.google.com/privacy">Privacy Policy</a> and&nbsp;
      <a href="https://policies.google.com/terms">Terms of Service</a> apply.
    </Typography>
  );
});