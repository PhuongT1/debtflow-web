'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import { AppDialog } from '@/components/ui/app-dialog';
import { Button } from '@/components/ui/button';
import { updateParty } from '@/services/party.client';

export type EditablePartner = {
  id: string;
  name: string;
  code?: string | null;
  type?: 'CUSTOMER' | 'SUPPLIER' | 'BOTH';
  phone?: string | null;
  email?: string | null;
  taxCode?: string | null;
  address?: string | null;
};

type PartnerFormValues = {
  name: string;
  code: string;
  type: 'CUSTOMER' | 'SUPPLIER' | 'BOTH';
  phone: string;
  email: string;
  taxCode: string;
  address: string;
};

function toFormValues(partner: EditablePartner): PartnerFormValues {
  return {
    name: partner.name,
    code: partner.code ?? '',
    type: partner.type ?? 'BOTH',
    phone: partner.phone ?? '',
    email: partner.email ?? '',
    taxCode: partner.taxCode ?? '',
    address: partner.address ?? '',
  };
}

export function PartnerDetailsDialog({ partner }: { partner: EditablePartner }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<PartnerFormValues>(() => toFormValues(partner));
  const [errorMessage, setErrorMessage] = useState<string>();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: PartnerFormValues) => updateParty(partner.id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['partner-summary'] });
      setOpen(false);
    },
    onError: (error) =>
      setErrorMessage(error instanceof Error ? error.message : 'Không thể cập nhật đối tác.'),
  });

  useEffect(() => setValues(toFormValues(partner)), [partner]);

  const updateValue = <Key extends keyof PartnerFormValues>(
    key: Key,
    value: PartnerFormValues[Key],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const save = async () => {
    if (!values.name.trim()) {
      setErrorMessage('Tên đối tác là bắt buộc.');
      return;
    }

    setErrorMessage(undefined);
    mutation.mutate({ ...values, name: values.name.trim() });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} size="small" variant="secondary">
        Đối tác
      </Button>
      <AppDialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={() => (mutation.isPending ? undefined : setOpen(false))}
      >
        <DialogTitle>Thông tin đối tác</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: '12px !important' }}>
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
          <TextField
            fullWidth
            label="Tên đối tác"
            onChange={(event) => updateValue('name', event.target.value)}
            required
            value={values.name}
          />
          <TextField
            fullWidth
            label="Mã đối tác"
            onChange={(event) => updateValue('code', event.target.value)}
            value={values.code}
          />
          <TextField
            fullWidth
            label="Loại đối tác"
            onChange={(event) =>
              updateValue('type', event.target.value as PartnerFormValues['type'])
            }
            select
            value={values.type}
          >
            <MenuItem value="CUSTOMER">Khách hàng</MenuItem>
            <MenuItem value="SUPPLIER">Nhà cung cấp</MenuItem>
            <MenuItem value="BOTH">Cả hai</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Số điện thoại"
            onChange={(event) => updateValue('phone', event.target.value)}
            value={values.phone}
          />
          <TextField
            fullWidth
            label="Email"
            onChange={(event) => updateValue('email', event.target.value)}
            value={values.email}
          />
          <TextField
            fullWidth
            label="Mã số thuế"
            onChange={(event) => updateValue('taxCode', event.target.value)}
            value={values.taxCode}
          />
          <TextField
            fullWidth
            label="Địa chỉ"
            onChange={(event) => updateValue('address', event.target.value)}
            value={values.address}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button disabled={mutation.isPending} onClick={() => setOpen(false)} variant="secondary">
            Hủy
          </Button>
          <Button loading={mutation.isPending} onClick={save}>
            Lưu thay đổi
          </Button>
        </DialogActions>
      </AppDialog>
    </>
  );
}
