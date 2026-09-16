import { Box, Card, CardContent, Typography, type SxProps, type Theme } from '@mui/material';

export function SectionCard({
  title,
  description,
  action,
  children,
  contentSx,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  contentSx?: SxProps<Theme>;
}) {
  return (
    <Card elevation={0} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
      {title || description || action ? (
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 2,
            justifyContent: 'space-between',
            px: { xs: 2, sm: 2.5 },
            py: 2.25,
          }}
        >
          <Box>
            {title ? (
              <Typography sx={{ fontSize: 16.5, fontWeight: 800 }}>{title}</Typography>
            ) : null}
            {description ? (
              <Typography color="text.secondary" sx={{ fontSize: 12.5, mt: 0.35 }}>
                {description}
              </Typography>
            ) : null}
          </Box>
          {action}
        </Box>
      ) : null}
      <CardContent
        sx={[
          {
            p: { xs: 2, sm: 2.5 },
            pt: title || description || action ? 0 : { xs: 2, sm: 2.5 },
            '&:last-child': { pb: { xs: 2, sm: 2.5 } },
          },
          ...(Array.isArray(contentSx) ? contentSx : [contentSx]),
        ]}
      >
        {children}
      </CardContent>
    </Card>
  );
}
