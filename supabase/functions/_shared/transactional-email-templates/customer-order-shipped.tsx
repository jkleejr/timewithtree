import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = '나무와 걷는 시간'
const SUPPORT_EMAIL = 'timewithtree@gmail.com'

interface Props {
  orderNumber?: string
  customerName?: string
  recipientName?: string | null
  recipientPhone?: string | null
  recipientAddress?: string | null
  recipientPostalCode?: string | null
  shippingAddress?: string
  postalCode?: string | null
  customerPhone?: string
}

const Email = ({
  orderNumber = '-',
  customerName = '-',
  recipientName,
  recipientPhone,
  recipientAddress,
  recipientPostalCode,
  shippingAddress = '-',
  postalCode,
  customerPhone,
}: Props) => {
  const finalRecipientName = recipientName || customerName
  const finalRecipientPhone = recipientPhone || customerPhone || '-'
  const finalAddress = recipientAddress || shippingAddress
  const finalPostal = recipientPostalCode || postalCode

  return (
    <Html lang="ko" dir="ltr">
      <Head />
      <Preview>주문번호 {orderNumber} - 상품이 발송되었습니다</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>상품이 발송되었습니다</Heading>
          <Text style={muted}>{SITE_NAME}</Text>

          <Text style={intro}>
            {customerName} 고객님, 주문하신 상품이 발송되었습니다.
            <br />
            묘목 특성상 배송은 화물차(용달)로 진행되며, 도착 시간은 기사님이 직접 연락드립니다.
          </Text>

          <Section style={card}>
            <Text style={label}>주문번호</Text>
            <Text style={value}>{orderNumber}</Text>
            <Text style={label}>주문상태</Text>
            <Text style={value}>배송중</Text>
          </Section>

          <Heading as="h2" style={h2}>배송지 정보</Heading>
          <Section style={card}>
            <Text style={row}><strong>받는 분:</strong> {finalRecipientName}</Text>
            <Text style={row}><strong>전화번호:</strong> {finalRecipientPhone}</Text>
            <Text style={row}>
              <strong>주소:</strong>{' '}
              {finalPostal ? `[${finalPostal}] ` : ''}{finalAddress}
            </Text>
          </Section>

          <Text style={note}>
            * 용달 배송비는 도착 시 화물차 기사님께 직접 지불해주세요.
          </Text>

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
  component: Email,
  subject: (data: Record<string, any>) =>
    `[${SITE_NAME}] 상품이 발송되었습니다 (${data?.orderNumber ?? ''})`.trim(),
  displayName: '고객 - 배송 시작',
  previewData: {
    orderNumber: 'ORD-260618-0001',
    customerName: '홍길동',
    customerPhone: '010-1234-5678',
    shippingAddress: '서울특별시 강남구 테헤란로 123',
    postalCode: '06234',
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
const note = { fontSize: '12px', color: '#666666', margin: '16px 0 0' }
const footer = { fontSize: '12px', color: '#666666', margin: '32px 0 0', textAlign: 'center' as const, lineHeight: '1.6' }
const linkStyle = { color: '#2f7a30', textDecoration: 'underline' }
