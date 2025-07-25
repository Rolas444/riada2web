

import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Se añade la clase 'light' por defecto. El ThemeProvider del dashboard la sobreescribirá.
    <html lang="es" className="light" suppressHydrationWarning>
      <body>
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
          {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
