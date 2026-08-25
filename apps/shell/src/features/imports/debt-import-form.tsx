"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Alert, Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { ApiErrorNotice } from "@/components/ui/api-error-notice";
import { Button } from "@/components/ui/button";
import { FormActions } from "@/components/ui/form-layout";
import { useToast } from "@debtflow/react-ui";
import { requestJson } from "@/lib/api-client";

type ImportFormValues = {
  file: FileList;
};

export function DebtImportForm() {
  const [message, setMessage] = useState<string | null>(null);
  const { showToast } = useToast();
  const mutation = useMutation({
    mutationFn: (values: ImportFormValues) => {
      setMessage(null);
      const formData = new FormData();
      formData.append("file", values.file[0]);
      return requestJson<{ createdDebts: number; createdParties: number }>("/api/imports/debts", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: (data) => {
      const successMessage = `Đã import ${data.createdDebts} công nợ, tạo mới ${data.createdParties} khách hàng.`;
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
  const selectedFile = watch("file")?.[0];

  return (
    <Box component="form" noValidate onSubmit={handleSubmit((values) => mutation.mutate(values))} sx={{ display: "grid", gap: 2 }}>
      <Button component="label" variant="secondary">
        Chọn file Excel
        <input
          accept=".xlsx"
          hidden
          type="file"
          {...register("file", {
            required: "Vui lòng chọn file Excel .xlsx",
            validate: (files) => files?.[0]?.name.endsWith(".xlsx") || "Chỉ hỗ trợ file .xlsx",
          })}
        />
      </Button>
      {selectedFile ? <Typography sx={{ color: "text.secondary", fontWeight: 700 }}>Đã chọn: {selectedFile.name}</Typography> : null}
      {errors.file ? <Alert severity="error">{errors.file.message}</Alert> : null}
      <ApiErrorNotice error={mutation.error} />
      {message ? <Alert severity="success">{message}</Alert> : null}
      <FormActions><Button loading={mutation.isPending} type="submit">Import công nợ</Button></FormActions>
    </Box>
  );
}
