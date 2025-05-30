import { ScrollViewStyleReset } from 'expo-router/html';
import { THEME } from '@/constants/theme';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this file are embedded into the HTML document.

const responsiveBackground = `
body {
  background-color: ${THEME.COLORS.BACKGROUND.LIGHT};
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: ${THEME.COLORS.BACKGROUND.DARK};
  }
}`;

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover"
        />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
