'use client';

import { useTranslations } from 'next-intl';
import { MenuItem, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { AppSelect } from '@/components/ui/select';

export function PageSizeSelect({
  pageSize,
  options,
}: {
  pageSize: number;
  options: Array<{ size: number; href: string }>;
}) {
  const t = useTranslations('Pagination');
  const router = useRouter();
  if (options.length === 0) return null;

  return (
    <>
      <Typography color="text.secondary" variant="body2">
        {t('rows')}
      </Typography>
      <AppSelect
        size="small"
        sx={{ minWidth: 88, width: 88 }}
        value={String(pageSize)}
        onChange={(event) => {
          const selected = options.find((option) => String(option.size) === event.target.value);
          if (selected) router.push(selected.href, { scroll: false });
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.size} value={String(option.size)}>
            {option.size}
          </MenuItem>
        ))}
      </AppSelect>
    </>
  );
}
