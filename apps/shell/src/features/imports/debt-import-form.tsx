'use client';

import { useState } from 'react';
import { Alert, Box, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { useToast } from '@packages/ui-react';

import { ApiErrorNotice } from '@/components/ui/api-error-notice';
import { Button } from '@/components/ui/button';
import { FormActions } from '@/components/ui/form/layout';
import { importDebtWorkbook } from '@/services/import.client';

type ImportFormValues = {
  file: FileList;
};

export function DebtImportForm() {
  const ui = useTranslations('Workspace');

  const [message, setMessage] = useState<string | null>(null);
  const { showToast } = useToast();
  const mutation = useMutation({
    mutationFn: (values: ImportFormValues) => {
      setMessage(null);
      return importDebtWorkbook(values.file[0]);
    },
    onSuccess: (data) => {
      const successMessage = ui('importSummary', {
        value1: data.createdDebts,
        value2: data.createdParties,
      });
      setMessage(successMessage);
      showToast({ message: successMessage });
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ImportFormValues>();
  const selectedFile = watch('file')?.[0];

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      sx={{ display: 'grid', gap: 2 }}
    >
      <Button component="label" variant="secondary">
        {ui('chooseAnExcelFile')}
        <input
          accept=".xlsx"
          hidden
          type="file"
          {...register('file', {
            required: ui('pleaseChooseAnXlsxExcelFile'),
            validate: (files) =>
              files?.[0]?.name.endsWith('.xlsx') || ui('onlyXlsxFilesAreSupported'),
          })}
        />
      </Button>
      {selectedFile ? (
        <Typography sx={{ color: 'text.secondary', fontWeight: 700 }}>
          {ui('selected')} {selectedFile.name}
        </Typography>
      ) : null}
      {errors.file ? <Alert severity="error">{errors.file.message}</Alert> : null}
      <ApiErrorNotice error={mutation.error} />
      {message ? <Alert severity="success">{message}</Alert> : null}
      <FormActions>
        <Button loading={mutation.isPending} type="submit">
          {ui('importDebts')}
        </Button>
      </FormActions>
    </Box>
  );
}
