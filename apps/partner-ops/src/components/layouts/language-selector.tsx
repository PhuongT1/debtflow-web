'use client';

import { useState } from 'react';
import type { AppLocale } from '@debtflow/contracts';
import { Button, Menu, MenuItem } from '@mui/material';

export function LanguageSelector({
  locale,
  onChange,
}: {
  locale: AppLocale;
  onChange: (locale: AppLocale) => void;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  return (
    <>
      <Button
        aria-controls={anchor ? 'partner-language-menu' : undefined}
        aria-expanded={anchor ? 'true' : undefined}
        aria-haspopup="menu"
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
      <Menu
        anchorEl={anchor}
        id="partner-language-menu"
        onClose={() => setAnchor(null)}
        open={Boolean(anchor)}
      >
        <MenuItem
          onClick={() => {
            onChange('vi');
            setAnchor(null);
          }}
          selected={locale === 'vi'}
        >
          🇻🇳 Tiếng Việt (VI)
        </MenuItem>
        <MenuItem
          onClick={() => {
            onChange('en');
            setAnchor(null);
          }}
          selected={locale === 'en'}
        >
          🇬🇧 English (EN)
        </MenuItem>
      </Menu>
    </>
  );
}
