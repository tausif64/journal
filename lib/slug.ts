export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 180);
}

export function buildArticleSlug(title: string, fallbackId?: string) {
  const base = slugify(title);
  if (base.length > 0) {
    return fallbackId ? `${base}-${fallbackId.slice(0, 6).toLowerCase()}` : base;
  }
  return fallbackId ? `article-${fallbackId.slice(0, 6).toLowerCase()}` : "article";
}
