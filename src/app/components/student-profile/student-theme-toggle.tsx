import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { useTheme } from 'next-themes';

type ThemeMode = 'light' | 'dark' | 'system';

interface StudentThemeToggleProps {
  onThemeChange?: (theme: ThemeMode) => void;
}

export function StudentThemeToggle({ onThemeChange }: StudentThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const activeTheme = (resolvedTheme ?? theme) as ThemeMode;
  const isDark = activeTheme === 'dark';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          <Label>Dark mode</Label>
          <p className="text-sm text-muted-foreground">Switch between light and dark themes.</p>
        </div>
        <Switch
          checked={isDark}
          onCheckedChange={(checked) => {
            const nextTheme: ThemeMode = checked ? 'dark' : 'light';
            setTheme(nextTheme);
            onThemeChange?.(nextTheme);
          }}
        />
      </CardContent>
    </Card>
  );
}
