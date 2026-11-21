import "server-only";

import type { Author, Category, StoryRecord } from "./model.ts";

export const authorFixtures = [
  { id: "author-01", name: "Nguyễn Lam Chi" },
  { id: "author-02", name: "Trần Minh Khuê" },
  { id: "author-03", name: "Lê Hải Đăng" },
  { id: "author-04", name: "Phạm Thu Ngân" },
  { id: "author-05", name: "Đỗ An Nhiên" },
  { id: "author-06", name: "Võ Quang Huy" },
  { id: "author-07", name: "Bùi Khánh Linh" },
  { id: "author-08", name: "Dương Mộc Miên" },
  { id: "author-09", name: "Hoàng Nhật Nam" },
  { id: "author-10", name: "Mai Thanh Bình" },
  { id: "author-11", name: "Đặng Tú Anh" },
  { id: "author-12", name: "Cao Bảo Trâm" },
] as const satisfies readonly Author[];

export const categoryFixtures = [
  {
    id: "category-01",
    slug: "tien-hiep",
    name: "Tiên hiệp",
    description: "Những hành trình tu luyện và khám phá thế giới rộng lớn.",
  },
  {
    id: "category-02",
    slug: "kiem-hiep",
    name: "Kiếm hiệp",
    description: "Ân tình, lời hứa và những cuộc gặp gỡ chốn giang hồ.",
  },
  {
    id: "category-03",
    slug: "huyen-huyen",
    name: "Huyền huyễn",
    description: "Các miền đất tưởng tượng với luật lệ và sinh linh riêng.",
  },
  {
    id: "category-04",
    slug: "do-thi",
    name: "Đô thị",
    description: "Những lát cắt đời thường giữa phố xá hôm nay.",
  },
  {
    id: "category-05",
    slug: "tinh-cam",
    name: "Tình cảm",
    description: "Chuyện về sự gắn bó, thấu hiểu và những lựa chọn.",
  },
  {
    id: "category-06",
    slug: "phieu-luu",
    name: "Phiêu lưu",
    description: "Những chuyến đi xa và các điều bất ngờ dọc đường.",
  },
  {
    id: "category-07",
    slug: "gia-tuong",
    name: "Giả tưởng",
    description: "Thế giới mới được xây dựng từ trí tưởng tượng.",
  },
  {
    id: "category-08",
    slug: "doi-thuong",
    name: "Đời thường",
    description: "Những câu chuyện nhỏ trong nhịp sống quen thuộc.",
  },
] as const satisfies readonly Category[];

const catalogCover = "/covers/catalog-placeholder.svg";

export const storyFixtures = [
  { id: "story-001", slug: "ben-song-co-may", title: "Bến Sông Có Mây", description: "Một người đưa thư trở về miền sông nước để tìm lại cuốn sổ của bà ngoại.", coverImage: catalogCover, authorId: "author-01", lifecycle: "ongoing", publicationStatus: "published", categoryIds: ["category-05", "category-08"], publishedAt: "2025-01-12T00:00:00.000Z", catalogUpdatedAt: "2025-03-20T08:00:00.000Z" },
  { id: "story-002", slug: "duong-len-thanh-van", title: "Đường Lên Thanh Vân", description: "Cô thợ mộc trẻ nhận lời sửa một cây đàn cũ và bắt đầu chuyến đi qua núi.", coverImage: catalogCover, authorId: "author-02", lifecycle: "ongoing", publicationStatus: "published", categoryIds: ["category-01", "category-06"], publishedAt: "2024-11-03T00:00:00.000Z", catalogUpdatedAt: "2025-03-22T10:30:00.000Z" },
  { id: "story-003", slug: "canh-cua-mua-thu", title: "Cánh Cửa Mùa Thu", description: "Hai người hàng xóm cùng chăm một khu vườn nhỏ trong con phố cũ.", coverImage: catalogCover, authorId: "author-03", lifecycle: "completed", publicationStatus: "published", categoryIds: ["category-05", "category-04"], publishedAt: "2024-06-18T00:00:00.000Z", catalogUpdatedAt: "2025-03-21T12:00:00.000Z" },
  { id: "story-004", slug: "vuon-sao-ben-doi", title: "Vườn Sao Bên Đồi", description: "Một nhóm bạn lập trạm quan sát bầu trời trên ngọn đồi sau làng.", coverImage: catalogCover, authorId: "author-04", lifecycle: "ongoing", publicationStatus: "published", categoryIds: ["category-07", "category-06"], publishedAt: "2025-02-01T00:00:00.000Z", catalogUpdatedAt: "2025-03-23T09:15:00.000Z" },
  { id: "story-005", slug: "la-thu-tu-phuong-nam", title: "Lá Thư Từ Phương Nam", description: "Một lá thư thất lạc nối lại tình bạn của hai người sau nhiều năm.", coverImage: catalogCover, authorId: "author-05", lifecycle: "completed", publicationStatus: "published", categoryIds: ["category-05", "category-08"], publishedAt: "2023-10-09T00:00:00.000Z", catalogUpdatedAt: "2025-03-19T16:40:00.000Z" },
  { id: "story-006", slug: "nguoi-giu-den-ben-cang", title: "Người Giữ Đèn Bến Cảng", description: "Người gác đèn giúp những con tàu tìm đường qua một mùa sương dày.", coverImage: catalogCover, authorId: "author-06", lifecycle: "hiatus", publicationStatus: "published", categoryIds: ["category-06", "category-03"], publishedAt: "2024-12-14T00:00:00.000Z", catalogUpdatedAt: "2025-03-18T07:20:00.000Z" },
  { id: "story-007", slug: "quan-tra-cuoi-hem", title: "Quán Trà Cuối Hẻm", description: "Tiệm trà nhỏ trở thành nơi những người xa lạ kể nhau nghe chuyện cũ.", coverImage: catalogCover, authorId: "author-07", lifecycle: "ongoing", publicationStatus: "published", categoryIds: ["category-04", "category-08"], publishedAt: "2025-01-28T00:00:00.000Z", catalogUpdatedAt: "2025-03-22T10:30:00.000Z" },
  { id: "story-008", slug: "kiem-khach-va-cay-ngo-dong", title: "Kiếm Khách Và Cây Ngô Đồng", description: "Một kiếm khách tìm người chủ cũ của chiếc hộp gỗ khắc hoa ngô đồng.", coverImage: catalogCover, authorId: "author-08", lifecycle: "completed", publicationStatus: "published", categoryIds: ["category-02", "category-05"], publishedAt: "2024-09-05T00:00:00.000Z", catalogUpdatedAt: "2025-03-17T11:10:00.000Z" },
  { id: "story-009", slug: "ban-do-nhung-con-duong-mat", title: "Bản Đồ Những Con Đường Mất", description: "Người vẽ bản đồ đi tìm các lối mòn dần biến mất khỏi vùng cao.", coverImage: catalogCover, authorId: "author-09", lifecycle: "ongoing", publicationStatus: "published", categoryIds: ["category-06", "category-07"], publishedAt: "2025-02-22T00:00:00.000Z", catalogUpdatedAt: "2025-03-23T09:15:00.000Z" },
  { id: "story-010", slug: "mua-ha-tren-san-thuong", title: "Mùa Hạ Trên Sân Thượng", description: "Những người thuê trọ chung khu nhà trồng rau và chia nhau mùa hè.", coverImage: catalogCover, authorId: "author-10", lifecycle: "hiatus", publicationStatus: "published", categoryIds: ["category-04", "category-08"], publishedAt: "2024-08-11T00:00:00.000Z", catalogUpdatedAt: "2025-03-16T14:00:00.000Z" },
  { id: "story-011", slug: "cua-tiem-ban-thoi-gian", title: "Cửa Tiệm Bán Thời Gian", description: "Một cửa tiệm kỳ lạ chỉ nhận thanh toán bằng những ký ức vui.", coverImage: catalogCover, authorId: "author-11", lifecycle: "ongoing", publicationStatus: "published", categoryIds: ["category-03", "category-07"], publishedAt: "2025-03-02T00:00:00.000Z", catalogUpdatedAt: "2025-03-24T06:45:00.000Z" },
  { id: "story-012", slug: "nhung-mua-hoa-o-xom-tren", title: "Những Mùa Hoa Ở Xóm Trên", description: "Một người làm vườn ghi lại những thay đổi nhỏ của xóm qua từng mùa.", coverImage: catalogCover, authorId: "author-12", lifecycle: "completed", publicationStatus: "published", categoryIds: ["category-08", "category-05"], publishedAt: "2023-12-20T00:00:00.000Z", catalogUpdatedAt: "2025-03-15T09:00:00.000Z" },
  { id: "story-013", slug: "ben-kia-dai-ngan-ha", title: "Bên Kia Dải Ngân Hà", description: "Phi hành đoàn khảo sát một hành tinh nơi đêm kéo dài suốt nhiều tháng.", coverImage: catalogCover, authorId: "author-01", lifecycle: "ongoing", publicationStatus: "published", categoryIds: ["category-07", "category-06"], publishedAt: "2025-01-05T00:00:00.000Z", catalogUpdatedAt: "2025-03-14T18:00:00.000Z" },
  { id: "story-014", slug: "nghe-nhan-giu-lua", title: "Nghệ Nhân Giữ Lửa", description: "Người thợ gốm trẻ học cách giữ lò nung cũ qua mùa mưa dài.", coverImage: catalogCover, authorId: "author-02", lifecycle: "hiatus", publicationStatus: "published", categoryIds: ["category-08", "category-05"], publishedAt: "2024-10-17T00:00:00.000Z", catalogUpdatedAt: "2025-03-13T10:00:00.000Z" },
  { id: "story-015", slug: "thanh-pho-duoi-tan-la", title: "Thành Phố Dưới Tán Lá", description: "Một thành phố bé nhỏ được dựng lên giữa khu rừng già.", coverImage: catalogCover, authorId: "author-03", lifecycle: "ongoing", publicationStatus: "published", categoryIds: ["category-03", "category-07"], publishedAt: "2024-12-02T00:00:00.000Z", catalogUpdatedAt: "2025-03-12T13:25:00.000Z" },
  { id: "story-016", slug: "nha-ga-luc-nam-gio", title: "Nhà Ga Lúc Năm Giờ", description: "Chuyến tàu cuối ngày luôn mang theo một món đồ ai đó đánh rơi.", coverImage: catalogCover, authorId: "author-04", lifecycle: "completed", publicationStatus: "published", categoryIds: ["category-04", "category-03"], publishedAt: "2023-07-19T00:00:00.000Z", catalogUpdatedAt: "2025-03-11T08:30:00.000Z" },
  { id: "story-017", slug: "duoi-mai-hien-xanh", title: "Dưới Mái Hiên Xanh", description: "Một cô giáo làng mở lớp học nhỏ dưới mái hiên sau cơn bão.", coverImage: catalogCover, authorId: "author-05", lifecycle: "ongoing", publicationStatus: "published", categoryIds: ["category-08", "category-05"], publishedAt: "2025-02-10T00:00:00.000Z", catalogUpdatedAt: "2025-03-10T17:15:00.000Z" },
  { id: "story-018", slug: "su-do-den-tu-mua", title: "Sứ Đồ Đến Từ Mưa", description: "Một sứ giả lạc đường tìm thấy ngôi làng chỉ xuất hiện khi trời mưa.", coverImage: catalogCover, authorId: "author-06", lifecycle: "hiatus", publicationStatus: "published", categoryIds: ["category-01", "category-03"], publishedAt: "2024-07-07T00:00:00.000Z", catalogUpdatedAt: "2025-03-09T10:40:00.000Z" },
  { id: "story-019", slug: "nhat-ky-cua-nguoi-trong-cay", title: "Nhật Ký Của Người Trồng Cây", description: "Mỗi trang nhật ký ghi lại một hạt giống và một người ghé qua.", coverImage: catalogCover, authorId: "author-07", lifecycle: "completed", publicationStatus: "published", categoryIds: ["category-08", "category-04"], publishedAt: "2024-02-14T00:00:00.000Z", catalogUpdatedAt: "2025-03-08T12:00:00.000Z" },
  { id: "story-020", slug: "mien-dat-tren-may-trang", title: "Miền Đất Trên Mây Trắng", description: "Đoàn thám hiểm dựng trại trên cao nguyên luôn phủ mây.", coverImage: catalogCover, authorId: "author-08", lifecycle: "ongoing", publicationStatus: "published", categoryIds: ["category-06", "category-01"], publishedAt: "2025-01-31T00:00:00.000Z", catalogUpdatedAt: "2025-03-07T07:50:00.000Z" },
  { id: "story-021", slug: "cau-chuyen-ben-lo-say", title: "Câu Chuyện Bên Lò Sấy", description: "Những người làm trà chia sẻ chuyện đời khi chờ mẻ trà mới.", coverImage: catalogCover, authorId: "author-09", lifecycle: "hiatus", publicationStatus: "published", categoryIds: ["category-08", "category-04"], publishedAt: "2024-05-01T00:00:00.000Z", catalogUpdatedAt: "2025-03-06T15:00:00.000Z" },
  { id: "story-022", slug: "doi-kiem-ben-ho-lanh", title: "Đôi Kiếm Bên Hồ Lạnh", description: "Hai người bạn cũ cùng lần theo dấu tích của một môn phái bỏ hoang.", coverImage: catalogCover, authorId: "author-10", lifecycle: "completed", publicationStatus: "published", categoryIds: ["category-02", "category-01"], publishedAt: "2023-11-22T00:00:00.000Z", catalogUpdatedAt: "2025-03-05T11:00:00.000Z" },
  { id: "story-023", slug: "mot-ngay-khong-co-dong-ho", title: "Một Ngày Không Có Đồng Hồ", description: "Cả khu phố thử sống một ngày không nhìn giờ giấc.", coverImage: catalogCover, authorId: "author-11", lifecycle: "ongoing", publicationStatus: "published", categoryIds: ["category-04", "category-08"], publishedAt: "2025-03-01T00:00:00.000Z", catalogUpdatedAt: "2025-03-04T08:20:00.000Z" },
  { id: "story-024", slug: "duoi-tan-phuong-vi", title: "Dưới Tán Phượng Vĩ", description: "Bức ảnh cũ giúp một nhóm bạn tìm lại lời hẹn thuở nhỏ.", coverImage: catalogCover, authorId: "author-12", lifecycle: "completed", publicationStatus: "published", categoryIds: ["category-05", "category-08"], publishedAt: "2023-05-12T00:00:00.000Z", catalogUpdatedAt: "2025-03-03T13:00:00.000Z" },
  { id: "story-025", slug: "hanh-trinh-qua-thung-lung-xanh", title: "Hành Trình Qua Thung Lũng Xanh", description: "Một nhóm bạn trẻ chuyển sách đến những điểm trường xa.", coverImage: catalogCover, authorId: "author-01", lifecycle: "ongoing", publicationStatus: "published", categoryIds: ["category-06", "category-08"], publishedAt: "2024-12-23T00:00:00.000Z", catalogUpdatedAt: "2025-03-02T09:10:00.000Z" },
  { id: "story-026", slug: "nguoi-hoc-viec-o-thien-mon", title: "Người Học Việc Ở Thiên Môn", description: "Cậu học việc mới đến xưởng rèn trên núi, nơi mỗi thanh kiếm có một câu chuyện.", coverImage: catalogCover, authorId: "author-02", lifecycle: "ongoing", publicationStatus: "published", categoryIds: ["category-01", "category-02"], publishedAt: "2025-02-19T00:00:00.000Z", catalogUpdatedAt: "2025-03-01T16:00:00.000Z" },
  { id: "story-027", slug: "cua-can-tau-cuoi-cung", title: "Cửa Cận Tàu Cuối Cùng", description: "Nhân viên nhà ga giúp một hành khách tìm chiếc vali thất lạc.", coverImage: catalogCover, authorId: "author-03", lifecycle: "hiatus", publicationStatus: "published", categoryIds: ["category-04", "category-05"], publishedAt: "2024-03-29T00:00:00.000Z", catalogUpdatedAt: "2025-02-28T09:00:00.000Z" },
  { id: "story-028", slug: "may-troi-qua-mien-bac", title: "Mây Trôi Qua Miền Bắc", description: "Người chụp ảnh rong ruổi qua những thị trấn nhỏ để tìm một gam màu.", coverImage: catalogCover, authorId: "author-04", lifecycle: "completed", publicationStatus: "published", categoryIds: ["category-06", "category-08"], publishedAt: "2023-09-16T00:00:00.000Z", catalogUpdatedAt: "2025-02-27T14:35:00.000Z" },
  { id: "story-029", slug: "canh-cua-mua-thu-thu-hai", title: "Cánh Cửa Mùa Thu", description: "Một họa sĩ trẻ phát hiện khu vườn nơi những chiếc lá luôn đổi màu.", coverImage: catalogCover, authorId: "author-05", lifecycle: "ongoing", publicationStatus: "published", categoryIds: ["category-03", "category-05"], publishedAt: "2025-03-05T00:00:00.000Z", catalogUpdatedAt: "2025-02-26T11:00:00.000Z" },
  { id: "story-030", slug: "nhung-vet-muc-tren-ban-do", title: "Những Vệt Mực Trên Bản Đồ", description: "Nhà khảo cổ học lần theo các ghi chú mới xuất hiện trên tấm bản đồ cũ.", coverImage: catalogCover, authorId: "author-06", lifecycle: "hiatus", publicationStatus: "published", categoryIds: ["category-07", "category-06"], publishedAt: "2024-04-03T00:00:00.000Z", catalogUpdatedAt: "2025-02-25T08:45:00.000Z" },
  { id: "story-031", slug: "tinh-thu-gui-nguoi-ban-cu", title: "Tình Thư Gửi Người Bạn Cũ", description: "Một người viết thư tay cho người bạn đã lâu không gặp.", coverImage: catalogCover, authorId: "author-07", lifecycle: "completed", publicationStatus: "published", categoryIds: ["category-05", "category-08"], publishedAt: "2023-08-08T00:00:00.000Z", catalogUpdatedAt: "2025-02-24T12:00:00.000Z" },
  { id: "story-032", slug: "ngon-den-trong-thung-lung", title: "Ngọn Đèn Trong Thung Lũng", description: "Những người dân trong thung lũng thay nhau chăm ngọn đèn bên đường.", coverImage: catalogCover, authorId: "author-08", lifecycle: "ongoing", publicationStatus: "published", categoryIds: ["category-03", "category-01"], publishedAt: "2025-01-17T00:00:00.000Z", catalogUpdatedAt: "2025-02-23T18:05:00.000Z" },
  { id: "story-033", slug: "khuc-hat-cua-tho-ren-gia", title: "Khúc Hát Của Thợ Rèn Già", description: "Người thợ rèn chỉ nhận sửa những món đồ mang theo kỷ niệm.", coverImage: catalogCover, authorId: "author-09", lifecycle: "hiatus", publicationStatus: "published", categoryIds: ["category-02", "category-08"], publishedAt: "2024-01-21T00:00:00.000Z", catalogUpdatedAt: "2025-02-22T10:00:00.000Z" },
  { id: "story-034", slug: "pho-nho-sau-con-mua", title: "Phố Nhỏ Sau Cơn Mưa", description: "Những thay đổi trong khu phố bắt đầu từ một chiếc ô bị bỏ quên.", coverImage: catalogCover, authorId: "author-10", lifecycle: "ongoing", publicationStatus: "draft", categoryIds: ["category-04", "category-08"], publishedAt: null, catalogUpdatedAt: "2025-03-24T12:00:00.000Z" },
  { id: "story-035", slug: "nguoi-ke-chuyen-ben-cua-so", title: "Người Kể Chuyện Bên Cửa Sổ", description: "Một người kể chuyện ghi lại âm thanh và cuộc sống trên con phố.", coverImage: catalogCover, authorId: "author-11", lifecycle: "completed", publicationStatus: "archived", categoryIds: ["category-08", "category-05"], publishedAt: "2022-09-15T00:00:00.000Z", catalogUpdatedAt: "2025-03-25T09:00:00.000Z" },
  { id: "story-036", slug: "hat-mua-tren-mai-ngoi", title: "Hạt Mưa Trên Mái Ngói", description: "Cô bé hàng xóm và ông lão thợ ngói cùng sửa mái nhà trước mùa mưa.", coverImage: catalogCover, authorId: "author-12", lifecycle: "hiatus", publicationStatus: "draft", categoryIds: ["category-08", "category-05"], publishedAt: null, catalogUpdatedAt: "2025-03-26T09:00:00.000Z" },
] as const satisfies readonly StoryRecord[];
