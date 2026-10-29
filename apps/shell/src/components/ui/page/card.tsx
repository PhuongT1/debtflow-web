import { Box, Card as MuiCard, CardContent, Typography } from '@mui/material';
import { AppIconBadge } from '@packages/ui-react';
import { type AppIconName } from '@/components/ui/app-icon';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <MuiCard
      className={className}
      elevation={0}
      sx={{
        p: 2.5,
      }}
      {...props}
    />
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = 'blue',
  icon = 'dashboard',
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: 'blue' | 'green' | 'amber' | 'red';
  icon?: AppIconName;
}) {
  const paletteTones = {
    blue: 'primary',
    green: 'success',
    amber: 'warning',
    red: 'error',
  } as const;
  const paletteTone = paletteTones[tone];

  return (
    <Card className="group">
      <CardContent sx={{ display: 'grid', gap: 1, minHeight: 132, p: '0 !important' }}>
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
          <Typography color="text.secondary" sx={{ fontSize: 14, fontWeight: 800 }}>
            {label}
          </Typography>
          <AppIconBadge name={icon} tone={paletteTone} />
        </Box>
        <Typography
          color="text.primary"
          sx={{ fontSize: { xs: 23, xl: 26 }, fontWeight: 850, mt: 0.75 }}
        >
          {value}
        </Typography>
        {hint ? (
          <Typography color="text.secondary" sx={{ fontSize: 14, mt: 0.5 }}>
            {hint}
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
}
