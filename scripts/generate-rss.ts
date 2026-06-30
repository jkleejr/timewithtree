// Runs before `vite dev` and `vite build`; writes public/rss.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://timewithtree.co.kr";
const BUILD_DATE = new Date().toUTCString();

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;

interface FeedItem {
  title: string;
  link: string;
  description: string;
  guid: string;
}

const PRODUCT_HANDLE = "jacquemontii-birch";
const PRODUCT_VARIANTS = [
  { id: "jacq-r3", title: "R3, 잭큐몬티 자작나무", price: 100000, desc: "근원직경 (줄기의 지면에 닿는 부분의 지름)이 3cm인 자작나무 묘목" },
  { id: "jacq-r4", title: "R4, 잭큐몬티 자작나무", price: 120000, desc: "근원직경 (줄기의 지면에 닿는 부분의 지름)이 4cm인 자작나무 묘목" },
  { id: "jacq-r5", title: "R5, 잭큐몬티 자작나무", price: 150000, desc: "근원직경 (줄기의 지면에 닿는 부분의 지름)이 5cm의 자작나무 묘목" },
  { id: "jacq-dagan", title: "다간형, 잭큐몬티 자작나무", price: 150000, desc: "한 나무에서 여러 줄기가 자라는 다간형 자작나무" },
];

const PAGES: Array<{ path: string; title: string; description: string }> = [
  { path: "/", title: "나무와 걷는 시간 — 잭큐몬티 자작나무 농장", description: "한국에서 키운 잭큐몬티 자작나무. 세종·공주 농장의 에어포트에서 재배해 연중 식재가 가능합니다." },
  { path: "/shop", title: "구매하기", description: "잭큐몬티 자작나무 묘목 구매 (R3 / R4 / R5 / 다간형)." },
  { path: "/about", title: "농장 소개", description: "나무와 걷는 시간 농장 소개." },
  { path: "/aeroponics", title: "에어포닉스 재배", description: "에어포트(Air-Pot) 재배 방식 안내." },
  { path: "/planting", title: "식재 가이드", description: "자작나무 식재 방법과 관리 안내." },
  { path: "/pickup-guide", title: "픽업 안내", description: "농장 방문 및 픽업 안내." },
  { path: "/returns", title: "교환·반품 안내", description: "교환 및 반품 정책 안내." },
  { path: "/privacy", title: "개인정보처리방침", description: "개인정보처리방침." },
  { path: "/order-lookup", title: "주문 조회", description: "주문 번호로 비회원 주문을 조회합니다." },
];

const productItems: FeedItem[] = PRODUCT_VARIANTS.map((v) => ({
  title: v.title,
  link: `${BASE_URL}/product/${PRODUCT_HANDLE}`,
  description: `${v.desc}\n\n가격: ₩${v.price.toLocaleString("ko-KR")}`,
  guid: `${BASE_URL}/product/${PRODUCT_HANDLE}#${v.id}`,
}));

const pageItems: FeedItem[] = PAGES.map((p) => ({
  title: p.title,
  link: `${BASE_URL}${p.path}`,
  description: p.description,
  guid: `${BASE_URL}${p.path}`,
}));

const items = [...productItems, ...pageItems];

const itemsXml = items
  .map((it) =>
    [
      `    <item>`,
      `      <title>${escapeXml(it.title)}</title>`,
      `      <link>${escapeXml(it.link)}</link>`,
      `      <guid isPermaLink="false">${escapeXml(it.guid)}</guid>`,
      `      <pubDate>${BUILD_DATE}</pubDate>`,
      `      <description>${cdata(it.description)}</description>`,
      `    </item>`,
    ].join("\n"),
  )
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>나무와 걷는 시간</title>
    <link>${BASE_URL}</link>
    <description>잭큐몬티 자작나무 농장 소식 및 상품</description>
    <language>ko-kr</language>
    <lastBuildDate>${BUILD_DATE}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>
`;

writeFileSync(resolve("public/rss.xml"), rss);
console.log(`rss.xml written (${items.length} items)`);
