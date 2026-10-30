import { Box, MenuItem } from '@mui/material';
import { type Control, useFieldArray, useWatch } from 'react-hook-form';

import { FormInput } from '@packages/ui-react';

import { Button } from '@/components/ui/button';
import type { CatalogOptions } from '@/features/catalog/catalog.types';

import type { DebtFormInput } from './schema';

type DebtLineItemsProps = {
  catalog: CatalogOptions;
  control: Control<DebtFormInput>;
};

export function DebtLineItems({ catalog, control }: DebtLineItemsProps) {
  const { append, fields, remove } = useFieldArray({ control, name: 'items' });
  const items = useWatch({ control, name: 'items' }) ?? [];
  const total = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0,
  );

  return (
    <Box sx={{ display: 'grid', gap: 1.25 }}>
      <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <p className="font-semibold text-slate-900">Hàng hóa trong chứng từ</p>
          <p className="text-sm text-slate-500">
            Không bắt buộc, nhưng cần có để báo cáo theo ngành hàng/mặt hàng.
          </p>
        </Box>
        <Button
          onClick={() => append({ productId: '', quantity: '1', unitPrice: '' })}
          size="small"
          type="button"
          variant="secondary"
        >
          Thêm mặt hàng
        </Button>
      </Box>
      {fields.map((field, index) => (
        <Box
          key={field.id}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
            display: 'grid',
            gap: 1.25,
            p: 1.25,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gap: 1.25,
              gridTemplateColumns: {
                xs: '1fr',
                md: 'minmax(0, 2fr) repeat(2, minmax(0, 1fr)) auto',
              },
            }}
          >
            <FormInput select label="Mặt hàng" control={control} name={`items.${index}.productId`}>
              <MenuItem value="">Chọn mặt hàng</MenuItem>
              {catalog.products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {[product.name, product.brand?.name, product.category.name]
                    .filter(Boolean)
                    .join(' · ')}
                </MenuItem>
              ))}
            </FormInput>
            <FormInput
              label="Số lượng"
              type="number"
              control={control}
              name={`items.${index}.quantity`}
            />
            <FormInput
              label="Đơn giá"
              type="number"
              control={control}
              name={`items.${index}.unitPrice`}
            />
            <Button onClick={() => remove(index)} size="small" type="button" variant="secondary">
              Bỏ
            </Button>
          </Box>
          <p className="text-right text-sm font-semibold text-slate-600">
            Thành tiền:{' '}
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0,
            }).format(
              (Number(items[index]?.quantity) || 0) * (Number(items[index]?.unitPrice) || 0),
            )}
          </p>
        </Box>
      ))}
      {fields.length > 0 ? (
        <p className="text-right text-sm font-bold text-slate-900">
          Tổng dòng hàng:{' '}
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
          }).format(total)}
        </p>
      ) : null}
    </Box>
  );
}
