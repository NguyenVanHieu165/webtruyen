# Kế hoạch chuyển MySQL/Prisma

**Cổng hiện tại:** chưa triển khai database. Chỉ bắt đầu sau khi người dùng duyệt schema, các quyết định mở và phạm vi milestone tiếp theo.

## Trước migration

1. Duyệt `01-schema-design.md`, `02-relations-and-indexes.md`, `04-query-strategy.md` và các câu hỏi cuối `05-decisions-and-tradeoffs.md`.
2. Chốt phiên bản MySQL, hosting, charset/collation, timezone, backup/restore và quyền truy cập môi trường.
3. Chốt Prisma major, client generator, MySQL driver adapter, Prisma config và chính sách pin/upgrade.
4. Chốt ID format, publication enum, author cardinality, rights model, slug alias strategy và search key.
5. Chọn migration owner và quy trình deploy: backup, reviewed SQL/DDL, maintenance/lock expectation, rollback/forward-fix.
6. Tạo test database disposable; không dùng credentials production cho test.

## Giai đoạn đề xuất

| Giai đoạn | Nội dung | Exit criteria |
| --- | --- | --- |
| DB-0: phê duyệt | Quyết định các câu hỏi ở trên; đánh giá threat/secret handling và backup. | Scope schema được duyệt bằng quyết định rõ ràng. |
| DB-1: catalog core | Author, Story, Category, StoryCategory, publication/lifecycle, slug uniqueness, rights metadata cần cho public real content. Seed chỉ synthetic/licensed. | `prisma validate`, migration trên disposable MySQL, FK/unique/search/order tests pass. |
| DB-2: repository cutover | Prisma repository triển khai `CatalogRepository`; DTO projection/page count/list predicates khớp fixture service. | Integration tests so khớp contract; không trả draft/archived/rights-invalid; query plans được review. |
| DB-3: reader | Chapter metadata/body riêng; chapter rights/publish gate; slug/sequence constraints. | Rights, ordering, not-found và content rendering tests pass trước public launch. |
| DB-4: account/UGC | Auth.js tables, bookmarks/history; comments/moderation sau policy. | Auth/security/retention approvals và authorization tests pass. |

DB-3/4 không thuộc Milestone 4 và chưa được phép bắt đầu trong kết quả này.

## An toàn triển khai

- Mỗi migration cần review SQL phát sinh, index size/lock behavior và data-loss impact.
- Chạy migration trước trên disposable/staging snapshot; kiểm chứng backup/restore độc lập.
- Production deploy dùng identity/quyền riêng tối thiểu; không ghi `DATABASE_URL` vào source/docs/log.
- Nếu migration thất bại, dừng cutover, giữ nguyên backup và dùng rollback/forward-fix đã duyệt; không sửa tay production để che lỗi.
- Seed data không dùng nội dung/cover lấy từ website tham chiếu; quyền asset phải có provenance.
- Thay repository fixture bằng MySQL chỉ sau khi ứng dụng có test chứng minh cùng query semantics.

## Hiện trạng

Chưa cài Prisma, chưa có `schema.prisma`, chưa tạo migration, chưa mở MySQL connection, chưa tạo database và chưa seed database. Đây là chủ ý để giữ cổng phê duyệt schema.
