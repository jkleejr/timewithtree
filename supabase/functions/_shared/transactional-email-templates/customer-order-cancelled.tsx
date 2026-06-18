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
}

const Email = ({
  orderNumber = '-',
  customerName = '-',
}: Props) => (
  <Html lang="ko" dir="ltr">
    <Head />
    <Preview>주문번호 {orderNumber} - 주문이 취소되었습니다</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>주문이 취소되었습니다</Heading>
        <Text style={muted}>{SITE_NAME}</Text>

        <Text style={intro}>
          {customerName} 고객님, 주문번호 <strong>{orderNumber}</strong> 의 주문이 취소되었습니다.
          <br />
          이미 입금하신 경우, 환불 절차에 대해 별도로 연락드리겠습니다.
        </Text>

        <Section style={card}>
          <Text style={label}>주문번호</Text>
          <Text style={value}>{orderNumber}</Text>
          <Text style={label}>주문상태</Text>
          <Text style={value}>취소됨</Text>
        </Section>

        <Text style={footer}>
          취소 사유나 문의사항이 있으시면 <a href={`mailto:${SUPPORT_EMAIL}`} style={linkStyle}>{SUPPORT_EMAIL}</a> 으로 연락주세요.
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
    `[${SITE_NAME}] 주문이 취소되었습니다 (${data?.orderNumber ?? ''})`.trim(),
  displayName: '고객 - 주문 취소',
  previewData: {
    orderNumber: 'ORD-260618-0001',
    customerName: '홍길동',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif', padding: '24px 0' }
const container = { padding: '0 24px', maxWidth: '600px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 600, color: '#141414', margin: '0 0 4px' }
const muted = { fontSize: '13px', color: '#666666', margin: '0 0 24px' }
const intro = { fontSize: '14px', color: '#141414', lineHeight: '1.7', margin: '0 0 20px' }
const card = { backgroundColor: '#f7f5f1', border: '1px solid #e6e2da', borderRadius: '2px', padding: '16px 18px' }
const label = { fontSize: '11px', color: '#666666', margin: '0 0 2px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }
const value = { fontSize: '14px', color: '#141414', margin: '0 0 12px' }
const footer = { fontSize: '12px', color: '#666666', margin: '32px 0 0', textAlign: 'center' as const, lineHeight: '1.6' }
const linkStyle = { color: '#2f7a30', textDecoration: 'underline' }
