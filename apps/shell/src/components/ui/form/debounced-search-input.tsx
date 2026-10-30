'use client';

import { useEffect, useState } from 'react';
import { InputAdornment } from '@mui/material';

import { AppIcon } from '../app-icon';

import { Input } from './input';

type Props = {
  delay?: number;
  onSearch: (value: string) => void;
  placeholder: string;
  value: string;
};

/** A controlled search field that waits briefly before updating remote data. */
export function DebouncedSearchInput({ delay = 400, onSearch, placeholder, value }: Props) {
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  useEffect(() => {
    if (draft === value) return;

    const timeoutId = window.setTimeout(() => onSearch(draft.trim()), delay);
    return () => window.clearTimeout(timeoutId);
  }, [delay, draft, onSearch, value]);

  return (
    <Input
      aria-label={placeholder}
      onChange={(event) => setDraft(event.target.value)}
      placeholder={placeholder}
      size="small"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <AppIcon color="action" fontSize="small" name="search" />
            </InputAdornment>
          ),
        },
      }}
      value={draft}
    />
  );
}
