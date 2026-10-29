/** Shared composition metadata; no business data, requests or React dependencies. */
export const partnerListLayout = {
  maxWidth: 1440,
  size: 'small' as const,
  toolbarColumns: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
    md: 'repeat(3, minmax(0, 1fr))',
    lg: 'repeat(3, minmax(0, 1fr))',
    xl: 'repeat(3, minmax(0, 1fr))',
  },
  columns: {
    name: {
      key: 'name',
      fixed: 'left' as const,
      width: 260,
      skeleton: { items: [{ width: 178 }] },
    },
    type: { key: 'type', width: 180, skeleton: { items: [{ height: 24, width: 88 }] } },
    sale: { key: 'sale', width: 210, skeleton: { items: [{ width: 130 }] } },
    contact: {
      key: 'contact',
      width: 120,
      skeleton: { items: [{ width: 88 }, { height: 12, width: 88 }] },
    },
    receivable: {
      key: 'receivable',
      align: 'right' as const,
      width: 150,
      skeleton: { items: [{ width: 104 }] },
    },
    payable: {
      key: 'payable',
      align: 'right' as const,
      width: 150,
      skeleton: { items: [{ width: 104 }] },
    },
    actions: {
      key: 'actions',
      align: 'right' as const,
      fixed: 'right' as const,
      width: 300,
      skeleton: {
        direction: 'row' as const,
        items: [
          { height: 32, width: 112 },
          { height: 32, width: 32 },
          { height: 32, width: 90 },
        ],
      },
    },
  },
};
