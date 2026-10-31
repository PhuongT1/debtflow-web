'use client';

import { useRouter } from 'next/navigation';
import { MenuItem, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { SelectField } from '@/components/ui/form/select';

import type { PageSizeSelectProps } from './page-size-select.types';

export function PageSizeSelect({ pageSize, options }: PageSizeSelectProps) {
  const ui = useTranslations('Workspace');

  const router = useRouter();
  if (options.length === 0) return null;

  return (
    <>
      <Typography color="text.secondary" variant="body2">
        {ui('rowsPerPage')}
      </Typography>
      <SelectField
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
      </SelectField>
    </>
  );
}
