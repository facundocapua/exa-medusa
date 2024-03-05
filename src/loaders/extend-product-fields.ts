export default async function (): Promise<void> {
  const imports = (await import(
    '@medusajs/medusa/dist/api/routes/store/products/index'
  )) as any
  imports.allowedStoreProductsFields = [
    ...imports.allowedStoreProductsFields,
    'brand_id'
  ]
  imports.defaultStoreProductsFields = [
    ...imports.defaultStoreProductsFields,
    'brand_id'
  ]
  imports.allowedStoreProductsRelations = [
    ...imports.allowedStoreProductsRelations,
    'brand'
  ]
  imports.defaultStoreProductsRelations = [
    ...imports.defaultStoreProductsRelations,
    'brand'
  ]
}
