'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
  Box,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { AppIcon } from '@/components/ui/app-icon';
import { AppDialog } from '@/components/ui/dialog/dialog';
import { useOverlaySurface } from '@packages/ui-react';
import { Button } from '@/components/ui/button';

type HelpModalProps = {
  title: string;
  description: string;
  steps: string[];
  tips?: string[];
  buttonLabel?: string;
  surface?: boolean;
};

export function HelpModal({
  title,
  description,
  steps,
  tips = [],
  buttonLabel,
  surface = false,
}: HelpModalProps) {
  const t = useTranslations('Common');
  const overlay = useOverlaySurface();
  const [open, setOpen] = useState(surface);
  const close = () => {
    setOpen(false);
    overlay?.finish({ status: 'cancelled' });
  };

  return (
    <>
      {!surface && (
        <Button
          className="gap-2"
          startIcon={<AppIcon fontSize="small" name="help" />}
          type="button"
          variant="secondary"
          onClick={() => setOpen(true)}
        >
          {buttonLabel ?? t('help')}
        </Button>
      )}

      <AppDialog
        surfaceBody={surface}
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={close}
        remote={{ view: 'help', title, size: 'sm', input: { title, description, steps, tips } }}
      >
        <DialogTitle sx={{ pr: 6 }}>
          <Typography component="div" sx={{ fontSize: 20, fontWeight: 900 }}>
            {title}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {description}
          </Typography>
          <IconButton
            aria-label={t('closeHelp')}
            onClick={close}
            sx={{ position: 'absolute', right: 12, top: 12 }}
          >
            <AppIcon fontSize="small" name="close" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ fontWeight: 800 }}>{t('steps')}</Typography>
          <List>
            {steps.map((step, index) => (
              <ListItem
                key={step}
                sx={{
                  alignItems: 'flex-start',
                  bgcolor: 'action.hover',
                  borderRadius: 2,
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    alignItems: 'center',
                    bgcolor: 'primary.main',
                    borderRadius: '999px',
                    color: 'primary.contrastText',
                    display: 'flex',
                    fontSize: 12,
                    fontWeight: 900,
                    height: 24,
                    justifyContent: 'center',
                    mr: 1.5,
                    mt: 0.25,
                    width: 24,
                  }}
                >
                  {index + 1}
                </Box>
                <Typography sx={{ fontSize: 14 }}>{step}</Typography>
              </ListItem>
            ))}
          </List>
          {tips.length > 0 ? (
            <>
              <Typography sx={{ fontWeight: 800, mt: 2 }}>{t('tips')}</Typography>
              <List>
                {tips.map((tip) => (
                  <ListItem
                    key={tip}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      mb: 1,
                    }}
                  >
                    <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                      {tip}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </>
          ) : null}
        </DialogContent>
      </AppDialog>
    </>
  );
}
