export type CatalogOptions = {
  brands: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
  products: Array<{
    id: string;
    name: string;
    categoryId: string;
    brandId?: string | null;
    unit: string;
    category: { name: string };
    brand?: { name: string } | null;
  }>;
  provinces: Array<{ provinceCode: string; provinceName?: string | null }>;
};
