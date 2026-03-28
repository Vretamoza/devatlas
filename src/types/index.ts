export type ResourceType = string; // dynamic — sourced from resource_types table
export type ResourceStatus = "pending" | "learned";
export type SortOption = "newest" | "title" | "rating";

export interface ResourceTypeRecord {
  value: string;
  label: string;
  emoji: string;
  color: string; // daisyUI color modifier: primary, info, secondary, accent, etc.
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Subcategory {
  id: string;
  name: string;
  category_id: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  url: string;
  type: ResourceType;
  language: string;
  category_id: string | null;
  subcategory_id: string | null;
  is_favorite: boolean;
  status: ResourceStatus;
  rating: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // joined
  category?: Category;
  subcategory?: Subcategory;
  tags?: Tag[];
}
