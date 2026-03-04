import localFont from 'next/font/local';

/**
 * Montserrat font configuration
 * Using local font files from public/fonts directory
 */
export const montserrat = localFont({
  src: [
    {
      path: '../../../public/fonts/montserrat/Montserrat-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/montserrat/Montserrat-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/montserrat/Montserrat-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/montserrat/Montserrat-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/montserrat/Montserrat-Italic.ttf',
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
      path: '../../../public/fonts/nunito-sans/NunitoSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/nunito-sans/NunitoSans-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/nunito-sans/NunitoSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/nunito-sans/NunitoSans-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-nunito-sans',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});
