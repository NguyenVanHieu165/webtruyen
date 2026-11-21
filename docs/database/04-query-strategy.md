# Chiến lược truy vấn catalog

## Hợp đồng dữ liệu

Giữ `CatalogRepository` làm ranh giới nguồn dữ liệu; `catalogService` sở hữu lọc, thứ tự và DTO. Page Server Component parse query bằng Zod rồi gọi service. Repository Prisma tương lai nên diễn đạt cùng semantics trong SQL, không làm component tự query DB.

```text
Page (Server Component)
  -> query parser (Zod)
  -> catalog service / domain rules
  -> repository (fixture hiện tại | Prisma sau approval)
  -> minimal card/detail DTO
```

Public DTO chỉ gồm fields cần cho route: card có id/slug/title/cover/author/lifecycle/categories và ngày; detail thêm description. List query không lấy chapter body, rights evidence nội bộ hoặc account data.

## Public predicate

Với fixture: chỉ `publicationStatus = published`. Ở DB, public predicate là bắt buộc tại DAL cho mọi public query:

```text
story.publicationStatus = PUBLISHED
AND story rights satisfy the approved verified-rights policy
```

Policy phải được triển khai trong repository/query builder dùng chung, không dựa vào việc UI ẩn draft. Trạng thái `ARCHIVED` không phải `COMPLETED`; lifecycle không thay thế publication gate.

## Filters, search và ordering

- Search query: tiêu đề hoặc tên tác giả, với cùng quy tắc normalize ở cả hai source fields.
- Filter category bằng join `StoryCategory`; lifecycle bằng enum allowlist.
- Category page luôn lọc category slug và public predicate.
- `updated`: `catalogUpdatedAt DESC, id ASC`.
- `newest`: `publishedAt DESC, id ASC`.
- `title`: collation/title sort theo tiếng Việt với tie-breaker `id ASC`; xác minh cùng locale khi đổi từ `Intl.Collator("vi")` sang MySQL.
- Mọi ordering phải ổn định để page navigation không xáo trộn khi các khóa chính trùng.

## Vietnamese search

Fixture hiện normalize NFD marks, case, whitespace và chuyển `đ` thành `d`; giá trị gốc được giữ nguyên để hiển thị. Database migration cần test parity cho các cặp có dấu/không dấu và `d/đ`.

Đề xuất khởi đầu là lưu search key chuẩn hóa cạnh source row, cập nhật trong cùng transaction. `LIKE '%query%'` giữ semantics contains nhưng có thể scan rows; B-tree không làm truy vấn leading-wildcard nhanh. FULLTEXT có giới hạn parser/token và cần benchmark tiếng Việt. Meilisearch chỉ được chọn sau khi corpus/traffic cho thấy yêu cầu typo tolerance, facets hoặc relevance vượt giải pháp DB.

Không chuyển search key sang URL, title display hoặc slug; URL giữ query người dùng đã trim. Không log raw search term nếu sau này query logs được đưa ra telemetry mà chưa có retention/privacy review.

## Pagination và count

- Giữ contract hiện tại: page từ 1 đến 100, 24 item/page.
- DB list query cần projection tối thiểu, predicates giống nhau giữa count và page rows, deterministic ORDER BY.
- Offset pagination phù hợp page-number URLs và quy mô V1 đã được duyệt. Bảo đảm upper bound để tránh offset tùy ý.
- Page ngoài range trả trạng thái `out-of-range` và không trả items; không tự âm thầm clamp page về trang cuối.
- Khi volume lớn gây latency đo được, cân nhắc cursor/keyset pagination; nó đổi URL/UI contract và không thay thế page-number semantics nếu chưa được sản phẩm duyệt.
- N+1 relation reads không được lặp theo từng card; dùng select/include có giới hạn và kiểm tra query count.

## Transactions và consistency

- Catalog GET chỉ đọc; không cần transaction trừ khi count + rows phải nhất quán snapshot theo yêu cầu sản phẩm.
- Việc đổi slug/ghi alias, đổi rights state và publish cần transaction và server-side policy check.
- Nếu author/search key hoặc title/search key đổi, cập nhật derived keys trong cùng write transaction.
- Cache chỉ thêm sau khi có mutation/revalidation semantics và privacy review. Không cache draft, user data hoặc nội dung chưa được rights gate.

## Kiểm thử truy vấn khi chuyển DB

- Contract tests dùng cùng fixtures trên repository cũ và mới.
- Kiểm tra slug lookup, empty category, duplicate associations, lifecycle/publication filtering.
- Kiểm tra title/author search: hoa/thường, dấu thanh, `d/đ`, nhiều whitespace.
- Kiểm tra tie ordering, page 1/2/100, out-of-range và count/list predicate parity.
- Kiểm tra MySQL `EXPLAIN`, query count và latency trên corpus synthetic có kích thước đã ghi nhận; không suy ra hiệu năng từ 36 fixtures.
- Kiểm chứng rights-invalid/draft rows không đi vào DTO, metadata, sitemap hoặc cache.
