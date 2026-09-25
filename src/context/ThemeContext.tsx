// app/providers.tsx (or wherever you set this up)
import { ThemeProvider } from "next-themes";

export function ThemeContext({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  );
}
