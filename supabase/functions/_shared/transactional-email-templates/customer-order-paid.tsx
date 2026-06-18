import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = '나무와 걷는 시간'
const SUPPORT_EMAIL = 'timewithtree@gmail.com'

interface OrderItem {
  product_title: string
  variant_title?: string
  quantity: number
  unit_price: number
  line_total: number
}

interface Props {
  orderNumber?: string
  customerName?: string
  items?: OrderItem[]
  subtotal?: number | string
  currency?: string
}

const formatPrice = (amount: number | string | undefined, currency = 'KRW') => {
  const n = typeof amount === 'string' ? Number(amount) : amount
  if (n === undefined || Number.isNaN(n)) return '-'
  if (currency === 'KRW') return `₩${n.toLocaleString('ko-KR')}`
  return `${currency} ${n.toLocaleString()}`
}

const Email = ({
  orderNumber = '-',
  customerName = '-',
  items = [],
  subtotal = 0,
  currency = 'KRW',
}: Props) => (
  <Html lang="ko" dir="ltr">
    <Head />
    <Preview>주문번호 {orderNumber} - 입금이 확인되었습니다</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>입금이 확인되었습니다</Heading>
        <Text style={muted}>{SITE_NAME}</Text>

        <Text style={intro}>
          {customerName} 고객님, 입금이 정상적으로 확인되었습니다.
          <br />
          배송 준비가 완료되는 대로 다시 안내드리겠습니다.
        </Text>

        <Section style={card}>
          <Text style={label}>주문번호</Text>
          <Text style={value}>{orderNumber}</Text>
          <Text style={label}>주문상태</Text>
          <Text style={value}>결제 완료</Text>
        </Section>

        {items.length > 0 ? (
          <>
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
              <Text style={row}>
                <strong>총 주문 금액</strong>{' '}
                <span style={priceStyle}>{formatPrice(subtotal, currency)}</span>
              </Text>
            </Section>
          </>
        ) : null}

        <Text style={footer}>
          문의사항이 있으시면 <a href={`mailto:${SUPPORT_EMAIL}`} style={linkStyle}>{SUPPORT_EMAIL}</a> 으로 연락주세요.
          <br />
          감사합니다. — {SITE_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `[${SITE_NAME}] 입금이 확인되었습니다 (${data?.orderNumber ?? ''})`.trim(),
  displayName: '고객 - 입금 확인',
  previewData: {
    orderNumber: 'ORD-260618-0001',
    customerName: '홍길동',
    items: [
      { product_title: '자작나무', variant_title: 'R3', quantity: 1, unit_price: 100000, line_total: 100000 },
    ],
    subtotal: 100000,
    currency: 'KRW',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif', padding: '24px 0' }
const container = { padding: '0 24px', maxWidth: '600px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 600, color: '#141414', margin: '0 0 4px' }
const h2 = { fontSize: '14px', fontWeight: 600, color: '#141414', margin: '28px 0 10px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }
const muted = { fontSize: '13px', color: '#666666', margin: '0 0 24px' }
const intro = { fontSize: '14px', color: '#141414', lineHeight: '1.7', margin: '0 0 20px' }
const card = { backgroundColor: '#f7f5f1', border: '1px solid #e6e2da', borderRadius: '2px', padding: '16px 18px' }
const label = { fontSize: '11px', color: '#666666', margin: '0 0 2px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }
const value = { fontSize: '14px', color: '#141414', margin: '0 0 12px' }
const row = { fontSize: '14px', color: '#141414', lineHeight: '1.6', margin: '0 0 6px' }
const priceStyle = { color: '#2f7a30', fontVariantNumeric: 'tabular-nums' as const }
const hr = { borderColor: '#e6e2da', margin: '12px 0' }
const footer = { fontSize: '12px', color: '#666666', margin: '32px 0 0', textAlign: 'center' as const, lineHeight: '1.6' }
const linkStyle = { color: '#2f7a30', textDecoration: 'underline' }
