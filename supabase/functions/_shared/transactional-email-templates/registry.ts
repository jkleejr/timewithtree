/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as newOrderAdmin } from './new-order-admin.tsx'
import { template as customerOrderConfirmation } from './customer-order-confirmation.tsx'
import { template as customerOrderPaid } from './customer-order-paid.tsx'
import { template as customerOrderShipped } from './customer-order-shipped.tsx'
import { template as customerOrderCancelled } from './customer-order-cancelled.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'new-order-admin': newOrderAdmin,
  'customer-order-confirmation': customerOrderConfirmation,
  'customer-order-paid': customerOrderPaid,
  'customer-order-shipped': customerOrderShipped,
  'customer-order-cancelled': customerOrderCancelled,
}
