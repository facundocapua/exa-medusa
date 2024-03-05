export default async function (): Promise<void> {
  const imports = (await import(
    '@medusajs/medusa/dist/api/routes/admin/products/index'
  )) as any
  imports.defaultAdminProductFields = [
    ...imports.defaultAdminProductFields,
    'brand_id'
  ]
  imports.defaultAdminProductRelations = [
    ...imports.defaultAdminProductRelations,
    'brand'
  ]
}
