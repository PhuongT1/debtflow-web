'use client';

import { useState } from 'react';
import { Button, Box, Menu, MenuItem } from '@mui/material';
import type { AppLocale } from '@debtflow/contracts';

type AppShellLocaleMenuProps = {
  locale: AppLocale;
  onLocaleChange: (locale: AppLocale) => void;
};

export function AppShellLocaleMenu({ locale, onLocaleChange }: AppShellLocaleMenuProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  function selectLocale(nextLocale: AppLocale) {
    onLocaleChange(nextLocale);
    setAnchor(null);
  }

  return (
    <Box sx={{ mr: 1.5 }}>
      <Button
        color="inherit"
        onClick={(event) => setAnchor(event.currentTarget)}
        size="small"
        sx={{
          bgcolor: 'action.hover',
          borderRadius: 2,
          fontSize: 12,
          fontWeight: 750,
          minWidth: 64,
          px: 1.25,
          py: 0.5,
          textTransform: 'none',
        }}
      >
        {locale === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
      </Button>
      <Menu anchorEl={anchor} onClose={() => setAnchor(null)} open={Boolean(anchor)}>
        <MenuItem onClick={() => selectLocale('vi')} selected={locale === 'vi'}>
          🇻🇳 Tiếng Việt (VI)
        </MenuItem>
        <MenuItem onClick={() => selectLocale('en')} selected={locale === 'en'}>
          🇬🇧 English (EN)
        </MenuItem>
      </Menu>
    </Box>
  );
}
