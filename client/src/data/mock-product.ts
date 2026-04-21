import { Product } from "@/features/catalog/types";

const now = new Date().toISOString();

export const mockProducts: Product[] = [
    {
        id: "kv_01",
        name: "Gỏi Cuốn Tôm Thịt",
        description: "Tôm tươi, thịt ba chỉ, rau sống, chấm mắm nêm đậm đà.",
        imageUrl:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        unit: "cuốn",
        displayOrder: 1,
        isActive: true,
        createdAt: now,
    },
    {
        id: "kv_02",
        name: "Chả Giò Rế Hải Sản",
        description: "Vỏ rế giòn rụm, nhân tôm cua, ăn kèm rau sống.",
        imageUrl:
            "https://images.unsplash.com/photo-1564436872-f6d81182df12?auto=format&fit=crop&w=800&q=80",
        unit: "phần",
        displayOrder: 2,
        isActive: true,
        createdAt: now,
    },
    {
        id: "kv_03",
        name: "Nộm Hoa Chuối",
        description: "Vị chua ngọt, tai heo giòn sần sật, lạc rang thơm bùi.",
        imageUrl:
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
        unit: "phần",
        displayOrder: 3,
        isActive: true,
        createdAt: now,
    },
    {
        id: "kv_04",
        name: "Nem Nướng Nha Trang",
        description: "Nem nướng than hoa, cuốn bánh tráng và xoài xanh.",
        imageUrl:
            "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
        unit: "phần",
        displayOrder: 4,
        isActive: true,
        createdAt: now,
    },
    {
        id: "kv_05",
        name: "Bánh mì phô mai",
        description: "Bánh mì giòn rụm với lớp phô mai béo ngậy tan chảy.",
        imageUrl:
            "https://images.unsplash.com/photo-1598679253351-efb7b0459a75?auto=format&fit=crop&w=800&q=80",
        unit: "cái",
        displayOrder: 5,
        isActive: true,
        createdAt: now,
    },
    {
        id: "kv_06",
        name: "Khoai tây chiên",
        description: "Khoai tây chiên giòn, chấm cùng tương cà hoặc mayonnaise.",
        imageUrl:
            "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80",
        unit: "phần",
        displayOrder: 6,
        isActive: true,
        createdAt: now,
    },
    {
        id: "kv_07",
        name: "Phô mai que",
        description: "Phô mai mozzarella được bọc bột và chiên xù, kéo sợi hấp dẫn.",
        imageUrl:
            "https://images.unsplash.com/photo-1588476096489-a431384d4e07?auto=format&fit=crop&w=800&q=80",
        unit: "phần",
        displayOrder: 7,
        isActive: false,
        createdAt: now,
    },

    {
        id: "nuoc_01",
        name: "Phở Bò Đặc Biệt",
        description:
            "Tô xe lửa gồm tái, nạm, gầu, gân, bò viên. Nước dùng hầm 24h.",
        imageUrl:
            "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
        unit: "tô",
        displayOrder: 8,
        isActive: true,
        createdAt: now,
    },
    {
        id: "nuoc_02",
        name: "Bún Bò Huế",
        description: "Chân giò heo, chả cua, huyết, nước dùng cay nồng đặc trưng.",
        imageUrl:
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
        unit: "tô",
        displayOrder: 9,
        isActive: true,
        createdAt: now,
    },
    {
        id: "nuoc_03",
        name: "Bún Chả Hà Nội",
        description: "Chả nướng than hoa, nước mắm đu đủ cà rốt, nem rán.",
        imageUrl:
            "https://images.unsplash.com/photo-1594221708779-94832f4320d1?auto=format&fit=crop&w=800&q=80",
        unit: "phần",
        displayOrder: 10,
        isActive: true,
        createdAt: now,
    },
    {
        id: "com_01",
        name: "Cơm Tấm Sườn",
        description: "Sườn cốt lết nướng mật ong, bì thính, chả trứng, mỡ hành.",
        imageUrl:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        unit: "phần",
        displayOrder: 11,
        isActive: true,
        createdAt: now,
    },
    {
        id: "com_02",
        name: "Cơm Rang Dưa Bò",
        description: "Cơm chiên giòn hạt, dưa cải chua xào thịt bò mềm.",
        imageUrl:
            "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
        unit: "phần",
        displayOrder: 12,
        isActive: true,
        createdAt: now,
    },
    {
        id: "com_03",
        name: "Cá Kho Tộ",
        description: "Cá lóc kho tiêu trong tộ đất, ăn kèm cơm trắng nóng hổi.",
        imageUrl:
            "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=800&q=80",
        unit: "phần",
        displayOrder: 13,
        isActive: true,
        createdAt: now,
    },
    {
        id: "mc_04",
        name: "Mì Quảng",
        description: "Sợi mì vàng óng, tôm, thịt, trứng cút và bánh đa giòn.",
        imageUrl:
            "https://images.unsplash.com/photo-1626803775151-624690034a26?auto=format&fit=crop&w=800&q=80",
        unit: "tô",
        displayOrder: 14,
        isActive: true,
        createdAt: now,
    },
    {
        id: "mc_05",
        name: "Hủ tiếu Nam Vang",
        description:
            "Nước dùng trong ngọt, tôm, thịt bằm, tim, gan, trứng cút.",
        imageUrl:
            "https://images.unsplash.com/photo-1615937691194-97dbd3f3dc29?auto=format&fit=crop&w=800&q=80",
        unit: "tô",
        displayOrder: 15,
        isActive: false,
        createdAt: now,
    },
    {
        id: "mc_06",
        name: "Bánh xèo",
        description: "Vỏ bánh giòn rụm, nhân tôm thịt giá đỗ, ăn kèm rau sống.",
        imageUrl:
            "https://images.unsplash.com/photo-1633436375795-12b3b23927d0?auto=format&fit=crop&w=800&q=80",
        unit: "cái",
        displayOrder: 16,
        isActive: true,
        createdAt: now,
    },
    {
        id: "mc_07",
        name: "Lẩu Thái Tom Yum",
        description: "Lẩu chua cay với hải sản tươi sống, nấm và sả.",
        imageUrl:
            "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
        unit: "phần",
        displayOrder: 17,
        isActive: true,
        createdAt: now,
    },

    // =================================================================
    // Món Phụ
    // =================================================================
    {
        id: "rau_01",
        name: "Rau Muống Xào Tỏi",
        description: "Rau muống xanh non xào lửa lớn, tỏi phi thơm lừng.",
        imageUrl:
            "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
        unit: "đĩa",
        displayOrder: 18,
        isActive: true,
        createdAt: now,
    },
    {
        id: "rau_02",
        name: "Canh Chua Cá Lóc",
        description: "Vị chua thanh của me, bông điên điển, cá lóc đồng.",
        imageUrl:
            "https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=800&q=80",
        unit: "tô",
        displayOrder: 19,
        isActive: true,
        createdAt: now,
    },
    {
        id: "extra_01",
        name: "Cơm trắng",
        description: "Cơm trắng nóng hổi, hạt dẻo thơm.",
        imageUrl:
            "https://images.unsplash.com/photo-1586201375822-5226a4534a63?auto=format&fit=crop&w=800&q=80",
        unit: "chén",
        displayOrder: 20,
        isActive: true,
        createdAt: now,
    },

    // =================================================================
    // Đồ Uống
    // =================================================================
    {
        id: "drink_01",
        name: "Trà Đào Cam Sả",
        description: "Thanh mát, giải nhiệt, có miếng đào giòn.",
        imageUrl:
            "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
        unit: "ly",
        displayOrder: 21,
        isActive: true,
        createdAt: now,
    },
    {
        id: "drink_02",
        name: "Cà Phê Sữa Đá",
        description: "Đậm đà, tỉnh táo. Sử dụng hạt Robusta nguyên chất.",
        imageUrl:
            "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=800&q=80",
        unit: "ly",
        displayOrder: 22,
        isActive: true,
        createdAt: now,
    },
    {
        id: "drink_03",
        name: "Sinh Tố Bơ",
        description: "Bơ sáp dẻo mịn, sữa đặc ngọt ngào.",
        imageUrl:
            "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=800&q=80",
        unit: "ly",
        displayOrder: 23,
        isActive: true,
        createdAt: now,
    },
    {
        id: "drink_04",
        name: "Nước Ép Cam",
        description: "Cam vàng nguyên chất, bổ sung Vitamin C.",
        imageUrl:
            "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
        unit: "ly",
        displayOrder: 24,
        isActive: true,
        createdAt: now,
    },
    {
        id: "drink_05",
        name: "Trà sữa trân châu",
        description: "Hồng trà sữa béo ngậy cùng trân châu đen dai giòn.",
        imageUrl:
            "https://images.unsplash.com/photo-1558160074-2bf872151465?auto=format&fit=crop&w=800&q=80",
        unit: "ly",
        displayOrder: 25,
        isActive: true,
        createdAt: now,
    },
    {
        id: "drink_06",
        name: "Matcha latte",
        description: "Bột matcha Nhật Bản nguyên chất, pha cùng sữa tươi thanh mát.",
        imageUrl:
            "https://images.unsplash.com/photo-1563822552-3221c3701a6e?auto=format&fit=crop&w=800&q=80",
        unit: "ly",
        displayOrder: 26,
        isActive: true,
        createdAt: now,
    },
    {
        id: "drink_07",
        name: "Trà chanh",
        description: "Vị chua của chanh tươi, vị chát nhẹ của trà, giải nhiệt tức thì.",
        imageUrl:
            "https://images.unsplash.com/photo-1595981266638-a4438d3a21a3?auto=format&fit=crop&w=800&q=80",
        unit: "ly",
        displayOrder: 27,
        isActive: true,
        createdAt: now,
    },
    {
        id: "drink_08",
        name: "Trà sữa matcha",
        description: "Sự kết hợp hoàn hảo giữa trà sữa và bột matcha thơm lừng.",
        imageUrl:
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
        unit: "ly",
        displayOrder: 28,
        isActive: true,
        createdAt: now,
    },
    {
        id: "drink_09",
        name: "Cappuccino",
        description: "Cà phê espresso, sữa nóng và bọt sữa dày mịn.",
        imageUrl:
            "https://images.unsplash.com/photo-1572442388796-11668a65343d?auto=format&fit=crop&w=800&q=80",
        unit: "ly",
        displayOrder: 29,
        isActive: true,
        createdAt: now,
    },
    {
        id: "drink_10",
        name: "Nước ép dứa",
        description: "Dứa tươi ép nguyên chất, giàu vitamin và enzyme.",
        imageUrl:
            "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?auto=format&fit=crop&w=800&q=80",
        unit: "ly",
        displayOrder: 30,
        isActive: true,
        createdAt: now,
    },
    {
        id: "drink_11",
        name: "Sinh tố xoài",
        description: "Xoài chín ngọt lịm xay mịn cùng sữa và đá.",
        imageUrl:
            "https://images.unsplash.com/photo-1622899509302-3c4a1e545133?auto=format&fit=crop&w=800&q=80",
        unit: "ly",
        displayOrder: 31,
        isActive: true,
        createdAt: now,
    },
    {
        id: "drink_12",
        name: "Bạc xỉu",
        description: "Nhiều sữa hơn cà phê, vị ngọt béo, hương cà phê nhẹ nhàng.",
        imageUrl:
            "https://images.unsplash.com/photo-1517701559435-5054e1461c31?auto=format&fit=crop&w=800&q=80",
        unit: "ly",
        displayOrder: 32,
        isActive: true,
        createdAt: now,
    },
    {
        id: "drink_13",
        name: "Coca-cola",
        description: "Nước ngọt có ga giải khát.",
        imageUrl:
            "https://images.unsplash.com/photo-1622483767028-3f66f32a2ea7?auto=format&fit=crop&w=800&q=80",
        unit: "lon",
        displayOrder: 33,
        isActive: true,
        createdAt: now,
    },

    // =================================================================
    // Tráng Miệng
    // =================================================================
    {
        id: "tm_01",
        name: "Bánh Flan",
        description: "Mềm mịn, thơm trứng sữa, caramel đắng nhẹ.",
        imageUrl:
            "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80",
        unit: "cái",
        displayOrder: 34,
        isActive: true,
        createdAt: now,
    },
    {
        id: "tm_02",
        name: "Chè Hạt Sen",
        description: "Hạt sen bở tơi, nước đường phèn thanh mát.",
        imageUrl:
            "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
        unit: "chén",
        displayOrder: 35,
        isActive: true,
        createdAt: now,
    },
    {
        id: "tm_03",
        name: "Bánh ngọt",
        description: "Bánh bông lan mềm xốp với lớp kem tươi.",
        imageUrl:
            "https://images.unsplash.com/photo-1562440102-83df394da384?auto=format&fit=crop&w=800&q=80",
        unit: "cái",
        displayOrder: 36,
        isActive: true,
        createdAt: now,
    },
    {
        id: "tm_04",
        name: "Bánh tiramisu",
        description:
            "Bánh ngọt Ý với vị cà phê, rượu rum và phô mai mascarpone.",
        imageUrl:
            "https://images.unsplash.com/photo-1571115177228-4610209833a3?auto=format&fit=crop&w=800&q=80",
        unit: "cái",
        displayOrder: 37,
        isActive: true,
        createdAt: now,
    },
    {
        id: "tm_05",
        name: "Chè bưởi",
        description: "Cùi bưởi giòn sần sật, đậu xanh và nước cốt dừa béo ngậy.",
        imageUrl:
            "https://images.unsplash.com/photo-1606787366850-de6330128214?auto=format&fit=crop&w=800&q=80",
        unit: "chén",
        displayOrder: 38,
        isActive: false,
        createdAt: now,
    },
    {
        id: "tm_06",
        name: "Tàu hũ trân châu đường đen",
        description: "Tàu hũ mềm mịn, trân châu dai và siro đường đen thơm lừng.",
        imageUrl:
            "https://images.unsplash.com/photo-1534786423573-5e7db45a58c2?auto=format&fit=crop&w=800&q=80",
        unit: "chén",
        displayOrder: 39,
        isActive: true,
        createdAt: now,
    },
];