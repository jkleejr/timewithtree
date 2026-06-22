# Plan - Explain the "일자별 방문 추이" (Daily Visit Trends) section

This plan describes the purpose of the "일자별 방문 추이" section in the admin panel and explains why it currently shows "데이터가 없습니다." (No data). No code modifications are needed for this request as it is an informational query.

## Purpose of the Section
The "일자별 방문 추이" (Daily Visit Trends) card displays daily statistics on the volume of visits to your website:
- **Date (날짜)**: The calendar day.
- **Visitors (방문자)**: The number of unique browser sessions on that day.
- **Page Views (페이지뷰)**: The total number of pages loaded or navigated to on that day.

## Why it shows "No Data" (데이터가 없습니다.)
- The website uses an automated `usePageTracking` hook to record page views securely into the `page_views` table of your Lovable Cloud backend every time a user navigates between pages.
- Since this is a newly set up project or is being viewed in a clean preview environment with no active external traffic yet, the table is currently empty (`0` records).
- Once users (or you, in the preview window) start visiting and navigating different pages, these views are logged automatically, and this section will dynamically render the daily counts.
