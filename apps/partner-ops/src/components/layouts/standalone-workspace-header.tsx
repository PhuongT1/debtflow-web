'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import type { AppLocale, CoreIdentity } from '@packages/platform-contracts';
import { navigationItems } from '@packages/platform-navigation';
import { setStoredLocale, signOutFromPlatform } from '@packages/platform-sdk';
import { SignOutDialog } from '@packages/ui-react';

import { LanguageSelector } from '@/components/layouts/language-selector';
import { AppIcon } from '@/components/ui/app-icon';

type StandaloneWorkspaceHeaderProps = {
  identity: CoreIdentity;
  platformOrigin: string;
};

const standaloneNavigation = [
  { href: '/', label: 'Giới thiệu' },
  ...navigationItems
    .filter((item) => item.owner === 'partner-ops')
    .map(({ href }) => ({ href, label: 'Đối tác' })),
];

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === href : pathname === href || pathname.startsWith(href + '/');
}

/**
 * App-owned chrome for direct remote access. The local menu reads its domain
 * entry from the versioned neutral navigation contract. Platform chrome is not
 * imported: it is omitted entirely when the remote is composed.
 */
export function StandaloneWorkspaceHeader({
  identity,
  platformOrigin,
}: StandaloneWorkspaceHeaderProps) {
  const pathname = usePathname();
  const [accountAnchor, setAccountAnchor] = useState<HTMLElement | null>(null);
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [isSignOutRequested, setIsSignOutRequested] = useState(false);
  const locale = useLocale() as AppLocale;
  const tHeader = useTranslations('PartnerHeader');
  const tNavigation = useTranslations('Navigation');
  const tSignOut = useTranslations('SignOut');

  function handleSwitchLanguage(nextLocale: AppLocale) {
    setStoredLocale(nextLocale);
  }

  return (
    <Box
      component="header"
      sx={{ borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          minHeight: 64,
          mx: 'auto',
          maxWidth: 1440,
          px: { xs: 1.5, md: 2.5 },
          width: '100%',
        }}
      >
        <Stack spacing={0}>
          <Typography component="p" variant="headerTitle">
            {tHeader('title')}
          </Typography>
          <Typography color="text.secondary" component="p" variant="headerSubtitle">
            {tHeader('subtitle')}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
          <LanguageSelector locale={locale} onChange={handleSwitchLanguage} />
          <Stack spacing={0} sx={{ alignItems: 'flex-end' }}>
            <Typography component="p" variant="identity">
              {identity.name}
            </Typography>
            <Typography color="text.secondary" component="p" variant="caption">
              {identity.role}
            </Typography>
          </Stack>
          <IconButton
            aria-controls={accountAnchor ? 'partner-account-menu' : undefined}
            aria-expanded={accountAnchor ? 'true' : undefined}
            aria-haspopup="menu"
            aria-label={tHeader('openAccountMenu')}
            onClick={(event) => setAccountAnchor(event.currentTarget)}
            size="small"
          >
            <Avatar
              sx={{
                bgcolor: 'primary.light',
                color: 'text.brand',
                fontSize: 13,
                fontWeight: 800,
                height: 32,
                width: 32,
              }}
            >
              {identity.name.slice(0, 1).toUpperCase()}
            </Avatar>
          </IconButton>
          <Button component={Link} href={platformOrigin} size="small" variant="outlined">
            Platform
          </Button>
          <Menu
            anchorEl={accountAnchor}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            id="partner-account-menu"
            onClose={() => setAccountAnchor(null)}
            open={Boolean(accountAnchor)}
            slotProps={{
              paper: { sx: { minWidth: 220 } },
              transition: {
                onExited: () => {
                  if (isSignOutRequested) {
                    setIsSignOutRequested(false);
                    setIsSignOutOpen(true);
                  }
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          >
            <Box sx={{ px: 2, py: 1.25 }}>
              <Typography noWrap sx={{ fontSize: 13.5, fontWeight: 750 }}>
                {identity.name}
              </Typography>
              <Typography color="text.secondary" noWrap sx={{ fontSize: 12 }}>
                {identity.email}
              </Typography>
              <Typography color={'text.brand'} sx={{ fontSize: 10.5, fontWeight: 800, mt: 0.75 }}>
                {identity.role}
              </Typography>
            </Box>
            <Divider />
            <MenuItem
              onClick={() => {
                setIsSignOutRequested(true);
                setAccountAnchor(null);
              }}
              sx={{ color: 'error.main', fontWeight: 650 }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <AppIcon fontSize="small" name="logout" />
              </ListItemIcon>
              {tHeader('signOut')}
            </MenuItem>
          </Menu>
        </Stack>
      </Box>
      {isSignOutOpen ? (
        <SignOutDialog
          title={tSignOut('title')}
          confirmation={tSignOut('confirmation')}
          cancelLabel={tSignOut('cancel')}
          errorMessage={tSignOut('error')}
          onCancel={() => setIsSignOutOpen(false)}
          onConfirm={() => signOutFromPlatform(platformOrigin)}
        />
      ) : null}
      <Box
        component="nav"
        aria-label="Điều hướng Partner Operations"
        sx={{ borderTop: '1px solid', borderColor: 'divider' }}
      >
        <Stack
          aria-label="Các khu vực của Partner Operations"
          direction="row"
          spacing={0.5}
          sx={{
            mx: 'auto',
            maxWidth: 1440,
            overflowX: 'auto',
            px: { xs: 1.5, md: 2.5 },
            py: 0.75,
            width: '100%',
          }}
        >
          {standaloneNavigation.map((item) => (
            <Button
              color={isActive(pathname, item.href) ? 'primary' : 'inherit'}
              component={Link}
              href={item.href}
              key={item.href}
              size="small"
              sx={{
                flexShrink: 0,
                fontWeight: isActive(pathname, item.href) ? 800 : 650,
              }}
              variant={isActive(pathname, item.href) ? 'contained' : 'text'}
            >
              {item.href === '/' ? tNavigation('overview') : tNavigation('partners')}
            </Button>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
