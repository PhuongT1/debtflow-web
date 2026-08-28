"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Alert, Box, MenuItem } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { AppDatePicker } from "@/components/ui/app-date-picker";
import { Badge } from "@/components/ui/badge";
import { ClampedText } from "@/components/ui/clamped-text";
import { ConfirmActionButton } from "@/components/ui/confirm-action-button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { FilterActions } from "@/components/ui/filter-actions";
import { FormDialog } from "@/components/ui/form-dialog";
import { AppInput } from "@/components/ui/input";
import { AppSelect } from "@/components/ui/select";
import { HelpModal } from "@/components/ui/help-modal";
import { Page, PageHeader } from "@/components/ui/page";
import { PartyForm } from "@/features/parties/party-form";
import { partyTableColumns } from "@/features/parties/table-config";
import { requestJson } from "@/lib/api-client";
import { PartyType } from "@/lib/domain";
import { hrefWithPage, hrefWithPageSize } from "@/lib/pagination";
import { formatMoney } from "@/lib/utils";

type UserSummary = { id: string; name: string; email: string; status?: string };

type Party = {
  id: string;
  type: PartyType;
  code?: string | null;
  name: string;
  phone?: string | null;
  email?: string | null;
  taxCode?: string | null;
  address?: string | null;
  note?: string | null;
  creditLimit?: string | number | null;
  assignedToId?: string | null;
  assignedTo?: UserSummary | null;
  createdAt: string;
  _count: { debts: number };
};

type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

const partyFilterSchema = z
  .object({
    q: z.string(),
    type: z.string(),
    assignedToId: z.string(),
    createdFrom: z.string(),
    createdTo: z.string(),
  })
  .refine(
    (values) =>
      !values.createdFrom ||
      !values.createdTo ||
      values.createdFrom <= values.createdTo,
    {
      message: "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu",
      path: ["createdTo"],
    },
  );

type PartyFilterValues = z.infer<typeof partyFilterSchema>;

const typeLabel: Record<PartyType, string> = {
  CUSTOMER: "Khách hàng",
  SUPPLIER: "Nhà cung cấp",
  BOTH: "Cả hai",
};

const weekdayFormatter = new Intl.DateTimeFormat("vi-VN", { weekday: "short" });
const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const API_FILTER_KEYS = [
  "q",
  "type",
  "assignedToId",
  "createdFrom",
  "createdTo",
  "page",
  "pageSize",
] as const;

function getFilters(searchParams: URLSearchParams) {
  return Object.fromEntries(
    API_FILTER_KEYS.flatMap((key) => {
      const value = searchParams.get(key);
      return value === null ? [] : [[key, value]];
    }),
  ) as Record<(typeof API_FILTER_KEYS)[number], string | undefined>;
}

function getApiPath(
  path: string,
  filters?: Record<string, string | undefined>,
) {
  const searchParams = new URLSearchParams();

  Object.entries(filters ?? {}).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  const queryString = searchParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}

export function PartiesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const filters = getFilters(searchParams);
  const filterDefaults = useMemo<PartyFilterValues>(() => {
    const params = new URLSearchParams(searchKey);
    return {
      q: params.get("q") ?? "",
      type: params.get("type") ?? "",
      assignedToId: params.get("assignedToId") ?? "",
      createdFrom: params.get("createdFrom") ?? "",
      createdTo: params.get("createdTo") ?? "",
    };
  }, [searchKey]);
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors: filterErrors },
  } = useForm<PartyFilterValues>({
    defaultValues: filterDefaults,
    resolver: zodResolver(partyFilterSchema),
  });

  useEffect(() => reset(filterDefaults), [filterDefaults, reset]);

  function applyFilters(values: PartyFilterValues) {
    const nextParams = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (value) nextParams.set(key, value);
    });
    if (filters.pageSize) nextParams.set("pageSize", filters.pageSize);
    const query = nextParams.toString();
    router.push(query ? `/parties?${query}` : "/parties", { scroll: false });
  }

  function clearFilters() {
    reset({
      q: "",
      type: "",
      assignedToId: "",
      createdFrom: "",
      createdTo: "",
    });
    router.replace("/parties", { scroll: false });
  }

  const partiesQuery = useQuery({
    queryKey: ["parties", searchKey],
    queryFn: () =>
      requestJson<Paginated<Party>>(getApiPath("/api/parties", filters)),
  });
  const usersQuery = useQuery({
    queryKey: ["active-users"],
    queryFn: () => requestJson<UserSummary[]>("/api/users/options"),
    staleTime: 5 * 60_000,
  });
  const parties = partiesQuery.data ?? {
    items: [],
    total: 0,
    page: Number(filters.page ?? 1),
    pageSize: Number(filters.pageSize ?? 20),
  };
  const activeUsers = (usersQuery.data ?? [])
    .filter((user) => user.status === "ACTIVE")
    .sort((a, b) => a.name.localeCompare(b.name));
  const error = partiesQuery.error ?? usersQuery.error;
  const isLoading = partiesQuery.isLoading || usersQuery.isLoading;
  const columns: Array<DataTableColumn<Party>> = [
    { ...partyTableColumns.code, render: (party) => party.code ?? "-" },
    {
      ...partyTableColumns.name,
      render: (party) => (
        <Link
          className="font-semibold text-blue-600"
          href={`/parties/${party.id}`}
        >
          <ClampedText title={party.name}>{party.name}</ClampedText>
        </Link>
      ),
    },
    {
      ...partyTableColumns.type,
      render: (party) => (
        <Badge
          tone={
            party.type === "CUSTOMER"
              ? "blue"
              : party.type === "SUPPLIER"
                ? "amber"
                : "slate"
          }
        >
          {typeLabel[party.type]}
        </Badge>
      ),
    },
    {
      ...partyTableColumns.sale,
      render: (party) => party.assignedTo?.name ?? "-",
    },
    {
      ...partyTableColumns.createdAt,
      render: (party) => {
        const createdAt = new Date(party.createdAt);

        return (
          <div>
            <p className="font-semibold">{dateFormatter.format(createdAt)}</p>
            <p className="text-xs text-slate-500">
              {weekdayFormatter.format(createdAt)}
            </p>
          </div>
        );
      },
    },
    {
      ...partyTableColumns.creditLimit,
      render: (party) =>
        party.creditLimit ? formatMoney(party.creditLimit) : "-",
    },
    {
      ...partyTableColumns.contact,
      render: (party) => (
        <div>
          <p>{party.phone ?? "-"}</p>
          <p className="text-sm text-slate-500">{party.email ?? ""}</p>
        </div>
      ),
    },
    { ...partyTableColumns.debts, render: (party) => party._count.debts },
    {
      ...partyTableColumns.actions,
      render: (party) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <FormDialog
            buttonIcon="visibility"
            buttonLabel="View"
            buttonSize="small"
            buttonVariant="secondary"
            description="Xem và cập nhật thông tin khách hàng hoặc nhà cung cấp."
            iconOnly
            title={`View ${party.name}`}
          >
            <PartyForm
              endpoint={`/api/parties/${party.id}`}
              method="PATCH"
              submitLabel="Lưu thay đổi"
              users={activeUsers}
              initialValues={{
                type: party.type,
                code: party.code ?? "",
                name: party.name,
                phone: party.phone ?? "",
                email: party.email ?? "",
                taxCode: party.taxCode ?? "",
                creditLimit: party.creditLimit?.toString() ?? "",
                assignedToId: party.assignedToId ?? "",
                address: party.address ?? "",
                note: party.note ?? "",
              }}
            />
          </FormDialog>
          <ConfirmActionButton
            endpoint={`/api/parties/${party.id}`}
            confirmMessage="Bạn chắc chắn muốn xóa khách này? Khách còn công nợ chưa tất toán sẽ không xóa được."
            invalidateQueryKey={["parties"]}
            refreshRoute={false}
          />
        </Box>
      ),
    },
  ];

  return (
    <Page fillAvailable>
      <PageHeader
        compact
        title="Khách hàng / Nhà cung cấp"
        actions={
          <>
            <FormDialog
              buttonLabel="Thêm đối tác"
              description="Tạo khách hàng hoặc nhà cung cấp mới."
              title="Thêm đối tác"
            >
              <PartyForm users={activeUsers} />
            </FormDialog>
            <HelpModal
              title="Cách quản lý khách hàng"
              description="Mỗi khách chỉ nên tạo một lần, sau đó mọi công nợ và thanh toán sẽ gom về hồ sơ khách đó."
              steps={[
                "Tạo khách mới với tên, số điện thoại, mã số thuế nếu có.",
                "Gán sale phụ trách để biết ai phải theo dõi công nợ của khách này.",
                "Nhập hạn mức công nợ nếu shop/công ty có giới hạn cho khách mua thiếu.",
                "Bấm vào tên khách để xem Customer 360: tổng nợ, quá hạn, lịch sử công nợ.",
              ]}
              tips={[
                "Không cần tạo khách trùng nhiều lần như Excel. Tìm khách trước khi tạo mới.",
                "Với shop nhỏ, có thể chỉ nhập tên và số điện thoại là đủ để bắt đầu.",
              ]}
            />
          </>
        }
      />

      {error ? (
        <Alert severity="error">
          {error instanceof Error
            ? error.message
            : "Không thể tải danh sách đối tác"}
        </Alert>
      ) : null}
      <DataTable
        columns={columns}
        emptyMessage="Không có khách hàng / nhà cung cấp"
        fillHeight
        hrefForPage={(page) => hrefWithPage("/parties", filters, page)}
        hrefForPageSize={(pageSize) =>
          hrefWithPageSize("/parties", filters, pageSize)
        }
        loading={isLoading}
        page={parties.page}
        pageSize={parties.pageSize}
        rows={parties.items}
        toolbar={
          <DataTableToolbar
            columns={{
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "2fr repeat(2, minmax(150px, 1fr))",
              xl: "2fr repeat(4, minmax(140px, 1fr)) auto",
            }}
            onSubmit={handleSubmit(applyFilters)}
          >
            <AppInput
              autoComplete="off"
              label="Tìm khách"
              placeholder="Tên, mã, MST, điện thoại..."
              {...register("q")}
            />
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <AppSelect label="Loại" {...field} value={field.value ?? ""}>
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="CUSTOMER">Khách hàng</MenuItem>
                  <MenuItem value="SUPPLIER">Nhà cung cấp</MenuItem>
                  <MenuItem value="BOTH">Cả hai</MenuItem>
                </AppSelect>
              )}
            />
            <Controller
              control={control}
              name="assignedToId"
              render={({ field }) => (
                <AppSelect
                  label="Sale phụ trách"
                  {...field}
                  value={field.value ?? ""}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {activeUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </AppSelect>
              )}
            />
            <Controller
              control={control}
              name="createdFrom"
              render={({ field }) => (
                <AppDatePicker
                  error={Boolean(filterErrors.createdFrom)}
                  helperText={filterErrors.createdFrom?.message}
                  label="Tạo từ ngày"
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
            <Controller
              control={control}
              name="createdTo"
              render={({ field }) => (
                <AppDatePicker
                  error={Boolean(filterErrors.createdTo)}
                  helperText={filterErrors.createdTo?.message}
                  label="Đến ngày"
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
            <FilterActions onReset={clearFilters} resetHref="/parties" />
          </DataTableToolbar>
        }
        total={parties.total}
      />
    </Page>
  );
}
