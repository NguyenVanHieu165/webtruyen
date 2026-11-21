# Kiểm kê công nghệ và phạm vi M4

**Ngày rà soát:** 2026-11-21  
**Phạm vi:** trạng thái trong repository và đề xuất cho La Cà Truyện V1-A/V1-B. Đây là đánh giá dự án độc lập, không khẳng định công nghệ phía sau website tham chiếu.

## Công nghệ hiện có

Phiên bản dưới đây được đối chiếu từ `package.json`, `package-lock.json` và `npm list --depth=0` tại thời điểm rà soát. Node/npm là runtime trên máy thực hiện kiểm tra.

| Thành phần | Phiên bản | Trạng thái và lý do |
| --- | --- | --- |
| Node.js | 24.22.3 | Runtime hiện tại; phù hợp với ứng dụng Next 16 trong môi trường này. |
| npm | 11.19.1 | Package manager được khóa trong `package.json`. |
| Next.js | 16.4.6 | App Router, Server Components, route metadata và server rendering. |
| React / React DOM | 19.3.1 | UI và rendering của Next.js. |
| TypeScript | 5.9.3, strict | Hợp đồng dữ liệu và kiểm tra tĩnh. |
| Tailwind CSS / PostCSS plugin | 4.3.5 | Styling; CSS được biên dịch, không tạo runtime styling client. |
| Zod | 4.6.7 | Parse và xác thực query boundary. |
| ESLint / eslint-config-next | 10.15.0 / 16.4.6 | Kiểm tra quy tắc JS/TS và Next.js. |
| `server-only` | 0.0.1 | Ngăn module fixture/repository phía server bị import vào client graph. |
| Node test runner | Built-in | Unit tests cho query, normalization và catalog service; không thêm test framework. |

`package-lock.json` tồn tại. Các package cài trực tiếp đều được pin bằng phiên bản cụ thể. Prisma, MySQL driver, Axios, animation/3D, state/query library, UI primitive, form/editor, Redis/queue, search service, E2E runner và telemetry SDK chưa được cài.

## Đánh giá các lựa chọn đang được cân nhắc

| Công nghệ / nhóm | Hiện trạng và vấn đề cần giải | Lợi ích | Chi phí / giới hạn | SSR/RSC, mobile và bundle | Quyết định thời điểm |
| --- | --- | --- | --- | --- | --- |
| Native `fetch` / Axios | Catalog hiện dùng repository local; chưa có HTTP integration cần Axios. | `fetch` có sẵn trong runtime, hỗ trợ Request/Response chuẩn; Axios chỉ hữu ích khi có client HTTP dùng chung/interceptor. | Axios thêm dependency, bundle/runtime surface và cấu hình không cần thiết cho dữ liệu nội bộ. | Server fetch không vào client bundle nếu giữ ở server module; mobile không liên quan. | Dùng `fetch` khi gọi dịch vụ ngoài được duyệt; chưa thêm Axios. |
| CSS / Motion / GSAP | Giao diện dùng CSS transitions; animation phức tạp chưa thuộc V1-A. | CSS nhỏ, chạy tốt trên mobile; Motion thuận tiện cho trạng thái UI; GSAP phù hợp timeline phức tạp. | Thư viện animation có thể thêm JS/hydration và cần kiểm soát reduced motion. Không nên dùng đồng thời hai hệ thống cho cùng UI. | CSS không tăng JS client; Motion/GSAP chỉ ở client island, tải theo nhu cầu. | Tiếp tục CSS; cân nhắc Motion cho tương tác UI cụ thể, GSAP cho timeline thương hiệu có yêu cầu rõ. |
| Three.js / React Three Fiber | Không có nội dung 3D hay canvas trong sản phẩm hiện tại. | Cho trải nghiệm 3D/WebGL có giá trị sản phẩm. | Tăng bundle, GPU/battery/memory use, rủi ro mobile và accessibility; cần fallback. | Chỉ tải client-side theo tương tác; tránh trên đường tải catalog chính. | Chưa thêm; chỉ xem xét khi có trải nghiệm 3D đã được duyệt và ngân sách hiệu năng. |
| TanStack Query / Zustand | URL query là state của catalog; Server Components gọi DAL trực tiếp. | TanStack Query hỗ trợ cache/refetch/mutation client; Zustand hợp với state client dùng chung. | Trùng với URL/server cache nếu dùng cho danh sách công khai; thêm client bundle và thêm một nguồn sự thật. | Không cần hydrate catalog fixture; nếu dùng sau này phải giới hạn vào client island. | Chưa dùng. Đánh giá TanStack Query khi có optimistic/infinite client workflow; Zustand khi state thật sự xuyên nhiều client island. |
| shadcn/ui / Radix / Lucide | UI hiện dùng HTML semantic và component nội bộ, không có primitive phức tạp bắt buộc. | Radix cung cấp primitive tương tác có accessibility; shadcn là mã được chọn lọc; Lucide nhất quán khi cần icon. | Component copied-in vẫn cần bảo trì; Radix có JS theo primitive; thêm toàn bộ bộ UI tạo churn. | Giữ primitive tương tác ở client leaf; icon SVG nhỏ nhưng cần kiểm soát số lượng. | Thêm chọn lọc khi có dialog/menu cần thiết. Không đưa nguyên bộ hoặc đổi hệ thống thiết kế trong M4. |
| React Hook Form / Tiptap | Form tìm kiếm hiện là GET form native; CMS chưa thuộc scope. | RHF phù hợp form client nhiều trường; Tiptap phù hợp editor rich-text dựa trên schema. | Thêm client state và dependency; nội dung editor phải có schema, validation, sanitizer và policy render. | RHF/Tiptap chỉ ở admin/editor client island, không tải trên catalog. | Chưa cài. Xem xét khi CMS được phê duyệt; lưu document có cấu trúc, không tin HTML tùy ý. |
| MySQL FULLTEXT / Meilisearch | V1-A hiện tìm trên 36 fixtures sau chuẩn hóa tiếng Việt. | FULLTEXT có thể giúp truy vấn văn bản ngay trong MySQL; Meilisearch có typo tolerance, ranking và facet. | Parser/ngôn ngữ/collation cần kiểm thử tiếng Việt; search service thêm vận hành, đồng bộ và eventual consistency. | Không tác động bundle; phụ thuộc latency/service availability và kế hoạch indexing. | Bắt đầu bằng MySQL query có giới hạn. Benchmark dữ liệu thật được cấp phép trước khi bật FULLTEXT; Meilisearch chỉ khi nhu cầu tìm kiếm vượt khả năng DB đo được. |
| Redis / BullMQ | Không có cache phân tán, queue hay tác vụ nền trong V1-A. | Redis hỗ trợ coordination/cache; BullMQ xử lý job retry/schedule trên Redis. | Vận hành thêm service, worker, failure modes và giám sát; không thay thế DB transaction. | Không tăng browser bundle; tăng runtime/infra phức tạp. | Chưa dùng. Thêm khi có job cụ thể như import/notification hoặc giới hạn rate phân tán. |
| Node test / Vitest / Playwright | Unit tests dùng `node:test`; Playwright chưa cài. | Node test runner không thêm dependency; Playwright kiểm tra browser, navigation, keyboard và responsive E2E. | Browser E2E tốn thời gian setup và runtime; component tests không thay E2E cho async Server Components. | Playwright chỉ là dev dependency; không vào production bundle. | Giữ unit tests hiện tại. Chọn Playwright trong milestone E2E khi có yêu cầu regression automation; M4 thực hiện QA browser thủ công, không thêm package. |
| Sentry / OpenTelemetry | Chưa có môi trường production hoặc yêu cầu vận hành được xác định. | Sentry thu thập lỗi; OpenTelemetry cung cấp traces/metrics theo chuẩn. | SDK/configuration, privacy review, sampling và chi phí vận hành; không thay thế structured logs. | Server SDK không vào browser bundle; client SDK phải giới hạn và scrub dữ liệu. | Chưa cài. Chọn telemetry sau khi hosting, retention, quyền truy cập và SLO được chốt. |
| Prisma + MySQL | Đã chốt làm đích dài hạn, nhưng chưa có schema được duyệt. | Quan hệ, transaction, foreign keys và truy vấn catalog rõ ràng. | Cần chốt MySQL version/collation, Prisma major/driver, schema, migration owner và rights gate. | Chỉ ở server-only DAL; không tạo Prisma Client trong client graph. | Giữ nguyên lựa chọn; M4 chỉ hoàn thiện đề xuất schema và dừng trước cài đặt/migration. |

## Ranh giới bằng chứng

- Repository hiện có là fixture catalog, không có database hoặc external API.
- Không suy ra được hosting, production traffic, SLO, quyền asset, backend, database hay API của website tham chiếu từ giao diện đã khảo sát.
- Research 08–12 là thiết kế đề xuất cho sản phẩm độc lập. Những route/chức năng chưa triển khai không phải cam kết runtime.

## Tài liệu kỹ thuật

- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js data fetching](https://nextjs.org/docs/app/getting-started/fetching-data)
- [Prisma database drivers](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/database-drivers)
- [MySQL FULLTEXT restrictions](https://dev.mysql.com/doc/refman/8.4/en/fulltext-restrictions.html)
- [Playwright introduction](https://playwright.dev/docs/intro)
- [BullMQ introduction](https://docs.bullmq.io/guide/introduction)
