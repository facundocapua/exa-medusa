import { registerOverriddenValidators } from '@medusajs/medusa'
import {
  AdminPostProductsProductReq as MedusaAdminPostProductsProductReq
} from '@medusajs/medusa/dist/api/routes/admin/products/update-product'

import { StoreGetProductsParams as MedusaStoreGetProductsParams } from '@medusajs/medusa/dist/api/routes/store/products/index'
import { IsString, IsOptional, IsArray } from 'class-validator'

class AdminPostProductsProductReq extends MedusaAdminPostProductsProductReq {
  @IsString()
  @IsOptional()
    brand_id: string
}
registerOverriddenValidators(AdminPostProductsProductReq)

class StoreGetProductsParams extends MedusaStoreGetProductsParams {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
    brand_id: string
}
registerOverriddenValidators(StoreGetProductsParams)
