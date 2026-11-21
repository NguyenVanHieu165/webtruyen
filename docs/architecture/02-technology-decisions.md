# Quyết định công nghệ

**Trạng thái:** đề xuất M4 cho V1-A; quyết định stack đã được người dùng chốt giữ nguyên. Tài liệu này không cấp phép triển khai database hoặc thêm package.

| Chủ đề | Quyết định | Lý do | Chi phí / giới hạn | Điều kiện xem xét lại |
| --- | --- | --- | --- | --- |
| Web framework | Next.js 16 App Router | Đã chốt; phục vụ route công khai, metadata và Server Components. | Gắn cách tổ chức route/render với framework. | Chỉ đổi khi chủ sản phẩm duyệt đổi nền tảng. |
| UI/runtime | React 19, TypeScript strict | Đã chốt; domain/query được type-check. | Cần giữ component boundaries nhỏ và DTO rõ. | Không thay trong V1-A. |
| Styling | Tailwind CSS 4 | Đã chốt và đang dùng. | Utility classes cần token/visual QA để tránh drift. | Chỉ bổ sung component styling dependency theo use case được duyệt. |
| Validation | Zod 4 tại input boundaries | Query parser hiện dùng Zod; schema có thể chia sẻ giữa UI/server logic mà không bỏ kiểm tra server-side. | Tránh validate cùng payload với quy tắc khác nhau ở nhiều lớp. | Giữ nguyên. |
| Public rendering | Server Components mặc định; client ở leaf tương tác | Catalog và story pages không cần client state; giảm JavaScript tải về và không gửi fixture đầy đủ tới browser. | Mọi browser API/interactivity cần ranh giới client tường minh. | Chỉ đưa component sang client khi có tương tác thực sự. |
| Data access | Server-only repository + catalog service | Page gọi DAL trực tiếp; repository hiện trả fixture, service lọc/sort/page/DTO. | Khi thay bằng Prisma, repository cần query projection và async DB semantics. | Repository triển khai MySQL/Prisma chỉ sau schema approval. |
| Database | MySQL/InnoDB + Prisma | Đã chốt theo yêu cầu. | Cần quyết định version, collation, adapter/generator, secrets và migration ownership. | Không đổi sang PostgreSQL. Chốt các chi tiết vận hành trước migration. |
| Query state | URL `q`, `category`, `status`, `sort`, `page` | Chia sẻ link, refresh, back/forward; không cần store client cho catalog. | Query contract phải reject duplicate/unsupported/invalid values. | Đổi contract chỉ sau khi kiểm tra linkability/SEO. |
| Search | Chuẩn hóa tiếng Việt ở domain; ban đầu không có search engine riêng | Fixture nhỏ; phép so sánh được kiểm thử và không đổi giá trị hiển thị gốc. | LIKE/contains query ở DB có thể scan; collation không được giả định xử lý `d/đ` như fixture. | Benchmark MySQL normalized key/FULLTEXT trên corpus hợp pháp; chỉ dùng Meilisearch khi yêu cầu đo được. |
| UI primitives | HTML semantic; thêm Radix/shadcn chọn lọc khi có dialog/menu | Search/filter/pagination hiện dùng GET form, select và Link. | Native controls có giới hạn về khả năng tùy biến; copied-in primitive cần bảo trì. | Thêm khi một interaction cụ thể cần primitive có accessibility. |
| Animation/3D | CSS transitions, reduced motion; không thêm GSAP/Motion/Three/R3F | Không có nhu cầu sản phẩm hiện tại; bảo vệ bundle và mobile. | CSS không phù hợp timeline phức tạp/3D. | Cân nhắc thư viện đúng cho trải nghiệm được duyệt, đo hiệu năng và có fallback. |
| Async jobs/cache | Không có Redis/BullMQ | Chưa có queue/cache workload. | Khi cần sẽ phát sinh worker, retry và vận hành. | Thêm khi có tác vụ nền hoặc coordination cụ thể. |
| Testing | Built-in Node test cho logic; QA browser thủ công trong M4 | Giữ test pure logic gọn, không thêm package ở audit này. | Không tự động phát hiện mọi browser/layout regression. | Phê duyệt Playwright trong milestone test automation. |
| Telemetry | Chưa có Sentry/OpenTelemetry | Chưa chốt hosting, retention, SLO hay quy tắc thu thập dữ liệu. | Lỗi production thiếu dashboard cho đến khi vận hành được thiết lập. | Chốt privacy/retention và SLO trước khi cài SDK. |

## Cổng thay đổi

1. Stack đã được chốt không đổi trong V1-A.
2. M4 có thể đề xuất lựa chọn package mới nhưng không cài package.
3. Prisma, schema, migration và kết nối MySQL cần duyệt schema riêng.
4. Các công nghệ phụ thuộc quy mô chỉ được thêm khi có use case và phép đo hỗ trợ.

## Tham chiếu

- [Next.js v16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js page `searchParams`](https://nextjs.org/docs/app/api-reference/file-conventions/page)
- [Prisma indexes](https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/indexes)
- [MySQL column indexes](https://dev.mysql.com/doc/refman/8.4/en/column-indexes.html)
