import localFont from 'next/font/local';

/**
 * Montserrat font configuration
 * Using local font files from public/fonts directory
 */
export const montserrat = localFont({
  src: [
    {
      path: '../../../public/fonts/montserrat/Montserrat-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/montserrat/Montserrat-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/montserrat/Montserrat-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/montserrat/Montserrat-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/montserrat/Montserrat-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-montserrat',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});

/**
 * Nunito Sans font configuration
 * Using local font files from public/fonts directory
 */
export const nunitoSans = localFont({
  src: [
    {
      path: '../../../public/fonts/nunito-sans/NunitoSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/nunito-sans/NunitoSans-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/nunito-sans/NunitoSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/nunito-sans/NunitoSans-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-nunito-sans',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});
