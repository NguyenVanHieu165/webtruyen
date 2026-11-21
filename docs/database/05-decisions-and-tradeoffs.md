# Quyết định và đánh đổi database

## Đã chốt

- Database đích là **MySQL**; ORM là **Prisma**.
- V1-A hiện dùng fixtures; M4 không tạo schema/migration, không cài Prisma và không kết nối DB.
- Public catalog cần pagination, typed filters và chỉ hiển thị story đã publish.
- Repository/service giữ ranh giới để thay nguồn fixture bằng repository MySQL khi được duyệt.

## Đề xuất cho lần schema approval

| Chủ đề | Đề xuất | Đánh đổi cần hiểu |
| --- | --- | --- |
| Author cardinality | Giữ `Story.authorId` 1:N như model/UI hiện tại; chuyển `StoryAuthor` M:N nếu đồng tác giả/role được xác nhận trước migration. | 1:N dễ query và ít model; M:N hỗ trợ co-author/translator nhưng cần primary/order/role semantics. |
| Catalog scope | Chỉ Author, Story, Category, StoryCategory và rights metadata phục vụ public real data. | Không chuẩn bị bảng account/chapter/UGC trước khi feature được duyệt. |
| Publication | Bắt đầu với `DRAFT/PUBLISHED/ARCHIVED` đúng code hiện tại; không thêm `HIDDEN/REMOVED` theo đề xuất research nếu semantics chưa rõ. | Hidden/removal có thể hữu ích cho moderation/takedown nhưng ảnh hưởng URL, audit và retention. |
| Rights | Rights là dimension riêng; public requires published + verified rights. Dùng `StoryRights` và `ChapterRights` nếu quyền từng chapter khác nhau. | Hai bảng rõ FK nhưng lặp field; bảng polymorphic gọn hơn nhưng yếu referential integrity nếu chỉ có nullable owner IDs. |
| Chapter rights inheritance | Chưa cho phép mặc định kế thừa; phải có quyết định về việc story license bao trùm chapter và ngoại lệ. | Kiểm tra kép chính xác nhưng tốn thao tác editorial; kế thừa dễ public nhầm nội dung ngoài giấy phép. |
| Search normalization | Chuẩn hóa `titleSearchKey` và author search key ở ứng dụng để đảm bảo hoa/dấu/`d-đ` như fixture. | Tăng dữ liệu dẫn xuất và yêu cầu mọi write path đồng bộ key; substring query vẫn có thể scan. |
| Search engine | Bắt đầu MySQL query; benchmark FULLTEXT trước. Meilisearch chỉ khi quality/latency/facet requirements chứng minh cần. | Không vận hành thêm service khi lượng dữ liệu nhỏ; FTS không đảm bảo tokenizer/relevance tiếng Việt mong muốn. |
| Slug | Unique lowercase slug cho Story và Category; không đổi slug theo title edit. Chưa cần aliases. Khi aliases được bật, chuyển sang namespace registry để uniqueness cross canonical/alias. | Registry tăng join/write transaction nhưng tránh collision liên bảng. |
| Pagination | Page-number + offset, giới hạn page 1–100 và 24 rows/page. | Dễ share URL; offset sâu chậm hơn keyset nhưng page limit giữ bounded. |
| Indexes | Thêm hai listing indexes và reverse `StoryCategory` index; lifecycle composite chỉ sau EXPLAIN. | Index giúp reads có thể làm writes/storage lớn hơn; query-driven giữ tradeoff có căn cứ. |
| IDs | Duy trì opaque stable IDs; chọn kiểu lưu (UUID string/binary hay strategy khác) cùng phiên bản Prisma/MySQL. | Cần cân bằng portability, kích thước index và API exposure; chưa có yêu cầu ép một format. |
| Collation/time | Chọn explicit MySQL charset/collation và UTC `DATETIME(3)` convention trước migration. | Collation ảnh hưởng uniqueness/sort/search; không nên dựa vào default server khác môi trường. |

## Câu hỏi cần trả lời trước migration

1. Sản phẩm xác nhận mỗi story chỉ có một author, hay cần đồng tác giả/dịch giả ngay từ DB đầu?
2. Status public giữ 3 giá trị hiện có hay cần `HIDDEN`/`REMOVED`? `ARCHIVED` còn truy cập trực tiếp được không?
3. Rights verification có bắt buộc trước khi đưa metadata/cover vào public catalog không? Story-level license bao trùm chapter trong trường hợp nào?
4. MySQL version/host, charset, collation và môi trường migration/backup là gì?
5. Chọn Prisma major, driver adapter/generator và biến cấu hình theo runtime nào?
6. ID format, slug alias/redirect requirement và search key persistence được duyệt ra sao?
7. Migration do ai sở hữu, chạy từ CI hay operator, và rollback/forward-fix được kiểm chứng ở đâu?

Các câu hỏi này là cổng thiết kế. Không được giải quyết ngầm bằng cách tạo schema/migration trước khi người dùng duyệt.

## Tính năng để tương lai

Chapter/reader, Auth.js User/Account/Session, bookmark, reading history, comment/moderation, rating/vote/support, admin/CMS, audit log, Redis/BullMQ, search indexing và analytics không thuộc schema catalog tối thiểu. Mỗi phần cần product/privacy/rights decision trước khi thêm.
