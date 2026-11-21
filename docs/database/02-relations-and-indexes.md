# Quan hệ, constraints và indexes

Tài liệu mô tả logical targets cho MySQL/InnoDB. DDL và tên index cuối cùng phải được xác nhận với Prisma version, MySQL version và query plans trước migration.

## Khóa và quan hệ

| Quan hệ | Quy tắc đề xuất | Constraint |
| --- | --- | --- |
| Author → Story | Một author có nhiều story; mỗi story có một author trong V1-A. | `Story.authorId` NOT NULL + FK tới `Author.id`; không xóa author còn story, ưu tiên archive. |
| Story ↔ Category | Nhiều-nhiều qua `StoryCategory`. | PK/unique `(storyId, categoryId)`; FK cả hai phía. |
| Story slug | Slug ASCII lowercase, thay đổi title không tự đổi slug. | `UNIQUE Story.slug`; validate format ở server. |
| Category slug | Định danh route category. | `UNIQUE Category.slug`; validate format ở server. |
| Slug alias | Chưa thuộc V1-A. Nếu cần, phải dùng namespace chung hoặc registry; unique ở hai bảng riêng không bảo đảm alias không trùng canonical slug. | Trước khi bật alias: registry `slug PRIMARY KEY`, story FK, kind canonical/alias; transaction bảo đảm story có một canonical slug và alias đổi redirect 308. |
| Publication | Draft/archived không xuất hiện trong public catalog. | Domain predicate luôn áp dụng ở DAL query; không dựa vào filter UI. |
| Content rights | Quyền nội dung độc lập với publish. | Public predicate cần trạng thái publish và rights verified; verifier/audit fields không được bỏ qua ở mutation. |
| Chapter ownership | Chưa cần V1-A. Khi có reader, chapter thuộc đúng story. | Unique `(storyId, sequence)` và `(storyId, slug)`; nếu comments gắn chapter, server xác minh chapter thuộc story. |

### Author cardinality

Model/fixtures hiện tại có `authorId` duy nhất và DTO hiển thị một tên. Giữ quan hệ 1:N là phương án ít phức tạp nhất cho catalog. Research 10 đề xuất `StoryAuthor` nhiều-nhiều; nếu chủ sản phẩm yêu cầu đồng tác giả/biên dịch/role trước DB milestone, quyết định M:N khi ấy và không cần tạo bảng join dư thừa trước xác nhận.

## Unique và check constraints

- PK: `Author.id`, `Story.id`, `Category.id`.
- Unique: `Story.slug`, `Category.slug`.
- Không unique `Author.displayName`: hai người có thể dùng cùng bút danh/hiển thị; author slug chỉ cần khi có route tác giả.
- `StoryCategory`: PK `(storyId, categoryId)` chống duplicate association.
- Nếu cần giữ quan hệ ngược category → stories, tạo index `(categoryId, storyId)`.
- `publishedAt` phải có giá trị khi `publicationStatus = PUBLISHED`; thực thi trước hết ở domain layer, cân nhắc CHECK sau khi xác minh server/version và Prisma migration SQL.
- Nếu dùng table rights với hai nullable owner FK, không để trạng thái XOR phụ thuộc vào hai nullable unique. Ưu tiên `StoryRights`/`ChapterRights` riêng; nếu dùng chung, cần CHECK `exactly one owner` và test migration trên MySQL đích.
- Rights transition phải lưu `verifiedBy`/`verifiedAt` khi trạng thái được xác minh. Không nhận quyền từ client payload.

## Index đề xuất theo truy vấn

| Truy vấn | Index khởi đầu | Ghi chú |
| --- | --- | --- |
| Tìm story theo slug | unique `Story(slug)` | Route story lookup. |
| Tìm category theo slug | unique `Category(slug)` | Route category lookup. |
| Catalog sort cập nhật | `(publicationStatus, catalogUpdatedAt, id)` | Đáp ứng equality filter trước sort key; đo ASC/DESC cùng MySQL query plan. |
| Catalog sort mới nhất | `(publicationStatus, publishedAt, id)` | Chỉ public rows; không dùng `publishedAt` null cho published. |
| Lọc category | PK `(storyId, categoryId)` + index `(categoryId, storyId)` | Index ngược cần cho list-by-category. |
| Lọc lifecycle | Chỉ thêm `(publicationStatus, lifecycle, catalogUpdatedAt, id)` hoặc biến thể khi workload/EXPLAIN chứng minh cần | Composite indexes tăng dung lượng và write cost. |
| Tìm title/author substring | Không có B-tree index hiệu quả cho leading wildcard | Search key bảo đảm semantics; cân nhắc FULLTEXT/search engine sau benchmark. |
| Chapter trong story | `(storyId, status, sequence)`; unique `(storyId, sequence)` | Tạo khi milestone reader duyệt status và ordering. |
| Bookmark/history | Unique `(userId, storyId)`; index theo list order (`userId, updatedAt/lastReadAt`) | Future; history semantics chưa được quyết định. |

Không tạo index “phòng xa”. Kiểm tra generated DDL, key length theo charset, query plan, cardinality và write overhead với dữ liệu thử nghiệm trước khi production migration.

## Delete và lifecycle

Archive/unpublish là thao tác nghiệp vụ mặc định; tránh hard-delete nội dung có audit/rights history. `StoryCategory` có thể cascade khi parent hard-delete; liên kết quyền/audit nên giữ theo retention policy hoặc restrict xóa. Chốt `onDelete` theo chính sách retention trước khi schema được tạo.
