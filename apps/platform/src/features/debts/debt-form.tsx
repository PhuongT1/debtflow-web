"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, MenuItem } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { ApiErrorNotice } from "@/components/ui/api-error-notice";
import { AppDatePicker } from "@/components/ui/app-date-picker";
import { Button } from "@/components/ui/button";
import { FormActions, FormGrid } from "@/components/ui/form-layout";
import { AppInput } from "@/components/ui/input";
import { AppSelect } from "@/components/ui/select";
import { useFormDialog } from "@/components/ui/form-dialog";
import { useToast } from "@debtflow/react-ui";
import { requestJson } from "@/lib/api-client";
import { applyApiFieldErrors } from "@/lib/form-errors";

const optionalDate = z.string().optional();
const positiveNumberString = z
  .string()
  .trim()
  .min(1, "Vui lòng nhập số tiền")
  .refine((value) => Number.isFinite(Number(value)), "Vui lòng nhập số hợp lệ")
  .refine((value) => Number(value) > 0, "Số tiền phải lớn hơn 0");

const debtFormSchema = z
  .object({
    type: z.enum(["RECEIVABLE", "PAYABLE"]),
    partyId: z.string().min(1, "Vui lòng chọn đối tác"),
    assignedToId: z.string().trim().optional(),
    title: z.string().trim().min(1, "Vui lòng nhập tiêu đề công nợ"),
    invoiceNo: z.string().trim().optional(),
    orderNo: z.string().trim().optional(),
    contractNo: z.string().trim().optional(),
    originalAmount: positiveNumberString,
    issueDate: z.string().min(1, "Vui lòng chọn ngày phát sinh"),
    dueDate: z.string().min(1, "Vui lòng chọn ngày đến hạn"),
    nextFollowUpAt: optionalDate,
    followUpNote: z.string().trim().optional(),
    description: z.string().trim().optional(),
  })
  .refine((value) => !value.issueDate || !value.dueDate || value.dueDate >= value.issueDate, {
    message: "Ngày đến hạn phải sau hoặc bằng ngày phát sinh",
    path: ["dueDate"],
  });

type DebtFormInput = z.input<typeof debtFormSchema>;
type DebtFormValues = z.output<typeof debtFormSchema>;

function withoutEmptyValues(values: DebtFormValues) {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value === "" ? undefined : value]));
}

export function DebtForm({
  parties,
  users = [],
}: {
  parties: Array<{ id: string; name: string }>;
  users?: Array<{ id: string; name: string; email: string }>;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const router = useRouter();
  const { closeDialog } = useFormDialog();
  const { showToast } = useToast();
  const mutation = useMutation({
    mutationFn: (values: DebtFormValues) =>
      requestJson("/api/debts", {
        method: "POST",
        body: JSON.stringify(withoutEmptyValues(values)),
      }),
    onSuccess: () => {
      closeDialog();
      showToast({ message: "Đã tạo công nợ thành công." });
      router.refresh();
    },
  });
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DebtFormInput, unknown, DebtFormValues>({
    resolver: zodResolver(debtFormSchema),
    defaultValues: {
      type: "RECEIVABLE",
      partyId: "",
      assignedToId: "",
      title: "",
      invoiceNo: "",
      orderNo: "",
      contractNo: "",
      issueDate: today,
      dueDate: today,
      nextFollowUpAt: "",
      followUpNote: "",
      description: "",
    },
  });

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit((values) => mutation.mutate(values, { onError: (error) => applyApiFieldErrors(error, setError) }))}
      sx={{ display: "grid", gap: 2 }}
    >
      <FormGrid>
        <AppSelect label="Loại công nợ *" {...register("type")} error={Boolean(errors.type)} helperText={errors.type?.message}>
          <MenuItem value="RECEIVABLE">Phải thu</MenuItem>
          <MenuItem value="PAYABLE">Phải trả</MenuItem>
        </AppSelect>
        <AppSelect label="Đối tác *" {...register("partyId")} error={Boolean(errors.partyId)} helperText={errors.partyId?.message}>
          <MenuItem value="">Chọn đối tác</MenuItem>
            {parties.map((party) => (
              <MenuItem key={party.id} value={party.id}>
                {party.name}
              </MenuItem>
            ))}
        </AppSelect>
        <AppSelect label="Sale phụ trách" {...register("assignedToId")} error={Boolean(errors.assignedToId)} helperText={errors.assignedToId?.message}>
          <MenuItem value="">Theo khách hàng / chưa gán</MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
        </AppSelect>
        <AppInput label="Tiêu đề *" placeholder="Công nợ hóa đơn..." {...register("title")} error={Boolean(errors.title)} helperText={errors.title?.message} />
        <AppInput label="Mã hóa đơn" placeholder="INV-..." {...register("invoiceNo")} error={Boolean(errors.invoiceNo)} helperText={errors.invoiceNo?.message} />
        <AppInput label="Mã đơn hàng" placeholder="SO-..." {...register("orderNo")} error={Boolean(errors.orderNo)} helperText={errors.orderNo?.message} />
        <AppInput label="Hợp đồng / PO" placeholder="HD-..." {...register("contractNo")} error={Boolean(errors.contractNo)} helperText={errors.contractNo?.message} />
        <AppInput label="Số tiền *" type="number" {...register("originalAmount")} error={Boolean(errors.originalAmount)} helperText={errors.originalAmount?.message} />
        <Controller
          control={control}
          name="issueDate"
          render={({ field }) => (
            <AppDatePicker
              error={Boolean(errors.issueDate)}
              helperText={errors.issueDate?.message}
              label="Ngày phát sinh"
              onChange={field.onChange}
              required
              value={field.value}
            />
          )}
        />
        <Controller
          control={control}
          name="dueDate"
          render={({ field }) => (
            <AppDatePicker
              error={Boolean(errors.dueDate)}
              helperText={errors.dueDate?.message}
              label="Ngày đến hạn"
              onChange={field.onChange}
              required
              value={field.value}
            />
          )}
        />
        <Controller
          control={control}
          name="nextFollowUpAt"
          render={({ field }) => (
            <AppDatePicker
              error={Boolean(errors.nextFollowUpAt)}
              helperText={errors.nextFollowUpAt?.message}
              label="Hẹn follow-up"
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
      </FormGrid>
      <AppInput label="Ghi chú thu tiền" placeholder="VD: Khách hẹn thanh toán thứ Sáu" {...register("followUpNote")} error={Boolean(errors.followUpNote)} helperText={errors.followUpNote?.message} />
      <AppInput label="Mô tả" multiline rows={3} {...register("description")} error={Boolean(errors.description)} helperText={errors.description?.message} />
      <ApiErrorNotice error={mutation.error} />
      <FormActions><Button disabled={parties.length === 0} loading={mutation.isPending} type="submit">Tạo công nợ</Button></FormActions>
    </Box>
  );
}
