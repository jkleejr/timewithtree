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
  customerPhone?: string
  customerEmail?: string
  shippingAddress?: string
  postalCode?: string | null
  recipientName?: string | null
  recipientPhone?: string | null
  recipientAddress?: string | null
  recipientPostalCode?: string | null
  deliveryDate?: string | null
  deliveryMessage?: string | null
  paymentMethod?: string
  depositorName?: string | null
  bankAccount?: string | null
  items?: OrderItem[]
  subtotal?: number | string
  currency?: string
  createdAt?: string
}

const formatPrice = (amount: number | string | undefined, currency = 'KRW') => {
  const n = typeof amount === 'string' ? Number(amount) : amount
  if (n === undefined || Number.isNaN(n)) return '-'
  if (currency === 'KRW') return `₩${n.toLocaleString('ko-KR')}`
  return `${currency} ${n.toLocaleString()}`
}

const paymentMethodLabel = (m?: string) => {
  if (m === 'bank_transfer') return '무통장입금'
  if (m === 'card') return '신용카드'
  return m || '무통장입금'
}

const CustomerOrderConfirmationEmail = ({
  orderNumber = '-',
  customerName = '-',
  customerPhone = '-',
  customerEmail = '-',
  shippingAddress = '-',
  postalCode,
  recipientName,
  recipientPhone,
  recipientAddress,
  recipientPostalCode,
  deliveryDate,
  deliveryMessage,
  paymentMethod = 'bank_transfer',
  depositorName,
  bankAccount,
  items = [],
  subtotal = 0,
  currency = 'KRW',
  createdAt,
}: Props) => {
  const createdAtStr = createdAt
    ? new Date(createdAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
    : '-'

  const recipientSame = !recipientName
  const showBank = paymentMethod === 'bank_transfer'

  return (
    <Html lang="ko" dir="ltr">
      <Head />
      <Preview>주문번호 {orderNumber} - 주문이 접수되었습니다</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>주문이 정상적으로 접수되었습니다</Heading>
          <Text style={muted}>{SITE_NAME}</Text>

          <Text style={intro}>
            {customerName} 고객님, 주문해주셔서 감사합니다.
            {showBank
              ? ' 아래 계좌로 입금이 확인되는 대로 배송 준비를 진행하겠습니다.'
              : ' 최대한 빠르게 배송 준비를 진행하겠습니다.'}
            <br />
            품절일 경우 전화로 안내드리겠습니다.
          </Text>

          <Section style={card}>
            <Text style={label}>주문번호</Text>
            <Text style={value}>{orderNumber}</Text>
            <Text style={label}>주문일시 (KST)</Text>
            <Text style={value}>{createdAtStr}</Text>
            <Text style={label}>주문상태</Text>
            <Text style={value}>{showBank ? '입금 대기중' : '주문 접수'}</Text>
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
            <Text style={row}>
              <strong>상품 합계</strong>{' '}
              <span style={priceStyle}>{formatPrice(subtotal, currency)}</span>
            </Text>
            <Text style={row}>
              <strong>용달 배송비</strong> 기사님께 직접 지불
            </Text>
            <Hr style={hr} />
            <Text style={totalRow}>
              <strong>총 주문 금액</strong>{' '}
              <span style={priceStyle}>{formatPrice(subtotal, currency)}</span>
            </Text>
          </Section>

          {showBank ? (
            <>
              <Heading as="h2" style={h2}>입금 안내</Heading>
              <Section style={card}>
                <Text style={row}><strong>입금 계좌:</strong> {bankAccount || 'NH농협은행 301-0327-2621-11'}</Text>
                <Text style={row}><strong>예금주:</strong> 고준서</Text>
                <Text style={row}><strong>입금자명:</strong> {depositorName || customerName}</Text>
                <Text style={rowEm}>
                  <strong>입금 금액:</strong>{' '}
                  <span style={priceStyle}>{formatPrice(subtotal, currency)}</span>
                </Text>
                <Text style={note}>
                  * 용달 배송비는 별도로 화물차 기사님께 직접 지불해주세요.
                </Text>
              </Section>
            </>
          ) : (
            <>
              <Heading as="h2" style={h2}>결제 정보</Heading>
              <Section style={card}>
                <Text style={row}><strong>결제수단:</strong> {paymentMethodLabel(paymentMethod)}</Text>
              </Section>
            </>
          )}

          <Heading as="h2" style={h2}>배송지 정보</Heading>
          <Section style={card}>
            {recipientSame ? (
              <>
                <Text style={row}><strong>받는 분:</strong> {customerName} (주문자와 동일)</Text>
                <Text style={row}><strong>핸드폰:</strong> {customerPhone}</Text>
                <Text style={row}>
                  <strong>주소:</strong>{' '}
                  {postalCode ? `[${postalCode}] ` : ''}{shippingAddress}
                </Text>
              </>
            ) : (
              <>
                <Text style={row}><strong>받는 분:</strong> {recipientName}</Text>
                <Text style={row}><strong>핸드폰:</strong> {recipientPhone || '-'}</Text>
                <Text style={row}>
                  <strong>주소:</strong>{' '}
                  {recipientPostalCode ? `[${recipientPostalCode}] ` : ''}
                  {recipientAddress || shippingAddress}
                </Text>
              </>
            )}
            {deliveryDate ? (
              <Text style={row}><strong>배송 희망일:</strong> {deliveryDate}</Text>
            ) : null}
            {deliveryMessage ? (
              <Text style={row}><strong>배송 요청사항:</strong> {deliveryMessage}</Text>
            ) : null}
          </Section>

          <Heading as="h2" style={h2}>주문자 정보</Heading>
          <Section style={card}>
            <Text style={row}><strong>이름:</strong> {customerName}</Text>
            <Text style={row}><strong>핸드폰:</strong> {customerPhone}</Text>
            <Text style={row}><strong>이메일:</strong> {customerEmail}</Text>
          </Section>

          <Text style={footer}>
            문의사항이 있으시면 <a href={`mailto:${SUPPORT_EMAIL}`} style={linkStyle}>{SUPPORT_EMAIL}</a> 으로 연락주세요.
            <br />
            감사합니다. — {SITE_NAME}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: CustomerOrderConfirmationEmail,
  subject: (data: Record<string, any>) =>
    `[${SITE_NAME}] 주문이 접수되었습니다 (${data?.orderNumber ?? ''})`.trim(),
  displayName: '고객 - 주문 확인',
  previewData: {
    orderNumber: 'ORD-260618-0001',
    customerName: '홍길동',
    customerPhone: '010-1234-5678',
    customerEmail: 'customer@example.com',
    shippingAddress: '서울특별시 강남구 테헤란로 123',
    postalCode: '06234',
    recipientName: null,
    recipientPhone: null,
    recipientAddress: null,
    recipientPostalCode: null,
    deliveryDate: '2026-06-25',
    deliveryMessage: '문 앞에 놓아주세요',
    paymentMethod: 'bank_transfer',
    depositorName: '홍길동',
    bankAccount: 'NH농협은행 301-0327-2621-11',
    items: [
      { product_title: '자작나무', variant_title: 'R3', quantity: 1, unit_price: 100000, line_total: 100000 },
    ],
    subtotal: 100000,
    currency: 'KRW',
    createdAt: new Date().toISOString(),
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
const rowEm = { fontSize: '14px', color: '#141414', lineHeight: '1.6', margin: '0 0 8px', fontWeight: 500 }
const totalRow = { fontSize: '15px', color: '#141414', margin: '8px 0 0' }
const priceStyle = { color: '#2f7a30', fontVariantNumeric: 'tabular-nums' as const }
const hr = { borderColor: '#e6e2da', margin: '12px 0' }
const note = { fontSize: '12px', color: '#666666', margin: '8px 0 0' }
const footer = { fontSize: '12px', color: '#666666', margin: '32px 0 0', textAlign: 'center' as const, lineHeight: '1.6' }
const linkStyle = { color: '#2f7a30', textDecoration: 'underline' }
