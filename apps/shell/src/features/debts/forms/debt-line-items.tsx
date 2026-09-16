import { useFieldArray, useWatch, type Control, type UseFormRegister } from 'react-hook-form';
import { Box, MenuItem } from '@mui/material';
import { Button } from '@/components/ui/button';
import { AppInput } from '@/components/ui/input';
import { AppSelect } from '@/components/ui/select';
import type { CatalogOptions } from '@/features/catalog/catalog.types';
import type { DebtFormInput } from './debt-form';

type DebtLineItemsProps = {
  catalog: CatalogOptions;
  control: Control<DebtFormInput>;
  register: UseFormRegister<DebtFormInput>;
};

export function DebtLineItems({ catalog, control, register }: DebtLineItemsProps) {
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
            <AppSelect label="Mặt hàng" {...register(`items.${index}.productId` as const)}>
              <MenuItem value="">Chọn mặt hàng</MenuItem>
              {catalog.products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {[product.name, product.brand?.name, product.category.name]
                    .filter(Boolean)
                    .join(' · ')}
                </MenuItem>
              ))}
            </AppSelect>
            <AppInput
              label="Số lượng"
              type="number"
              {...register(`items.${index}.quantity` as const)}
            />
            <AppInput
              label="Đơn giá"
              type="number"
              {...register(`items.${index}.unitPrice` as const)}
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
