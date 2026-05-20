import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = '나무와 걷는 시간'

interface OrderItem {
  product_title: string
  variant_title?: string
  quantity: number
  unit_price: number
  line_total: number
}

interface NewOrderAdminProps {
  orderNumber?: string
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  shippingAddress?: string
  postalCode?: string | null
  items?: OrderItem[]
  subtotal?: number | string
  currency?: string
  customerNote?: string | null
  createdAt?: string
}

const formatPrice = (amount: number | string | undefined, currency = 'KRW') => {
  const n = typeof amount === 'string' ? Number(amount) : amount
  if (n === undefined || Number.isNaN(n)) return '-'
  if (currency === 'KRW') return `₩${n.toLocaleString('ko-KR')}`
  return `${currency} ${n.toLocaleString()}`
}

const NewOrderAdminEmail = ({
  orderNumber = '-',
  customerName = '-',
  customerPhone = '-',
  customerEmail = '-',
  shippingAddress = '-',
  postalCode,
  items = [],
  subtotal = 0,
  currency = 'KRW',
  customerNote,
  createdAt,
}: NewOrderAdminProps) => {
  const createdAtStr = createdAt
    ? new Date(createdAt).toLocaleString('ko-KR')
    : '-'

  return (
    <Html lang="ko" dir="ltr">
      <Head />
      <Preview>새 주문 {orderNumber} - {customerName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>새 주문이 접수되었습니다</Heading>
          <Text style={muted}>{SITE_NAME}</Text>

          <Section style={card}>
            <Text style={label}>주문번호</Text>
            <Text style={value}>{orderNumber}</Text>
            <Text style={label}>주문일시</Text>
            <Text style={value}>{createdAtStr}</Text>
          </Section>

          <Heading as="h2" style={h2}>주문자 정보</Heading>
          <Section style={card}>
            <Text style={row}><strong>이름:</strong> {customerName}</Text>
            <Text style={row}><strong>전화:</strong> {customerPhone}</Text>
            <Text style={row}><strong>이메일:</strong> {customerEmail}</Text>
          </Section>

          <Heading as="h2" style={h2}>배송지</Heading>
          <Section style={card}>
            <Text style={row}>
              {postalCode ? `(${postalCode}) ` : ''}{shippingAddress}
            </Text>
            {customerNote ? (
              <Text style={row}><strong>메모:</strong> {customerNote}</Text>
            ) : null}
          </Section>

          <Heading as="h2" style={h2}>주문 상품</Heading>
          <Section style={card}>
            {items.map((it, idx) => (
              <Text key={idx} style={row}>
                {it.product_title}
                {it.variant_title && it.variant_title !== 'Default Title'
                  ? ` (${it.variant_title})`
                  : ''}{' '}× {it.quantity}{' '}
                <span style={priceStyle}>
                  {formatPrice(it.line_total, currency)}
                </span>
              </Text>
            ))}
            <Hr style={hr} />
            <Text style={totalRow}>
              <strong>합계</strong>{' '}
              <span style={priceStyle}>{formatPrice(subtotal, currency)}</span>
            </Text>
          </Section>

          <Text style={footer}>
            관리자 페이지에서 주문 상태를 확인하고 변경할 수 있습니다.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: NewOrderAdminEmail,
  subject: (data: Record<string, any>) =>
    `[${SITE_NAME}] 새 주문 ${data?.orderNumber ?? ''}`.trim(),
  displayName: '관리자 - 새 주문 알림',
  previewData: {
    orderNumber: 'TWT-20260520-0001',
    customerName: '홍길동',
    customerPhone: '010-1234-5678',
    customerEmail: 'customer@example.com',
    shippingAddress: '서울특별시 강남구 테헤란로 123',
    postalCode: '06234',
    items: [
      { product_title: '유기농 상추', variant_title: '200g', quantity: 2, unit_price: 5000, line_total: 10000 },
      { product_title: '방울토마토', variant_title: 'Default Title', quantity: 1, unit_price: 8000, line_total: 8000 },
    ],
    subtotal: 18000,
    currency: 'KRW',
    customerNote: '문 앞에 놓아주세요',
    createdAt: new Date().toISOString(),
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif', padding: '24px 0' }
const container = { padding: '0 24px', maxWidth: '600px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 600, color: '#141414', margin: '0 0 4px' }
const h2 = { fontSize: '14px', fontWeight: 600, color: '#141414', margin: '28px 0 10px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }
const muted = { fontSize: '13px', color: '#666666', margin: '0 0 24px' }
const card = { backgroundColor: '#f7f5f1', border: '1px solid #e6e2da', borderRadius: '2px', padding: '16px 18px' }
const label = { fontSize: '11px', color: '#666666', margin: '0 0 2px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }
const value = { fontSize: '14px', color: '#141414', margin: '0 0 12px' }
const row = { fontSize: '14px', color: '#141414', lineHeight: '1.6', margin: '0 0 6px' }
const totalRow = { fontSize: '15px', color: '#141414', margin: '8px 0 0', display: 'flex', justifyContent: 'space-between' }
const priceStyle = { color: '#2f7a30', fontVariantNumeric: 'tabular-nums' as const }
const hr = { borderColor: '#e6e2da', margin: '12px 0' }
const footer = { fontSize: '12px', color: '#666666', margin: '32px 0 0', textAlign: 'center' as const }
