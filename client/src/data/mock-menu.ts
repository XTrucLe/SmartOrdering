import { Menu } from "@/types";

export const MOCK_MENU: Menu = {
  id: "menu_01",
  name: "Thực đơn Nhà Hàng Việt",
  type: "MAIN",
  description: "Hương vị truyền thống, nguyên liệu tươi ngon mỗi ngày.",
  displayOrder: 1,
  sections: [
    {
      id: "sec_khaivi",
      name: "Khai Vị",
      displayOrder: 1,
      products: [
        {
          id: "kv_01",
          name: "Gỏi Cuốn Tôm Thịt",
          price: 15000,
          description: "Tôm tươi, thịt ba chỉ, rau sống, chấm mắm nêm đậm đà.",
          imageUrl:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
          displayOrder: 1,
        },
        {
          id: "kv_02",
          name: "Chả Giò Rế Hải Sản",
          price: 45000,
          description: "Vỏ rế giòn rụm, nhân tôm cua, ăn kèm rau sống.",

          imageUrl:
            "https://images.unsplash.com/photo-1564436872-f6d81182df12?auto=format&fit=crop&w=800&q=80",
          displayOrder: 2,
        },
        {
          id: "kv_03",
          name: "Nộm Hoa Chuối",
          price: 55000,
          description: "Vị chua ngọt, tai heo giòn sần sật, lạc rang thơm bùi.",
          imageUrl:
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
          displayOrder: 3,
        },
        {
          id: "kv_04",
          name: "Nem Nướng Nha Trang",
          price: 60000,
          description: "Nem nướng than hoa, cuốn bánh tráng và xoài xanh.",
          imageUrl:
            "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
          displayOrder: 4,
        },
      ],
    },

    {
      id: "sec_nuoc",
      name: "Phở & Bún",
      displayOrder: 2,
      products: [
        {
          id: "nuoc_01",
          name: "Phở Bò Đặc Biệt",
          price: 75000,
          description:
            "Tô xe lửa gồm tái, nạm, gầu, gân, bò viên. Nước dùng hầm 24h.",
          imageUrl:
            "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
          displayOrder: 1,
        },
        {
          id: "nuoc_02",
          name: "Bún Bò Huế",
          price: 65000,
          description:
            "Chân giò heo, chả cua, huyết, nước dùng cay nồng đặc trưng.",
          imageUrl:
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
          displayOrder: 2,
        },
        {
          id: "nuoc_03",
          name: "Bún Chả Hà Nội",
          price: 60000,
          description: "Chả nướng than hoa, nước mắm đu đủ cà rốt, nem rán.",
          imageUrl:
            "https://images.unsplash.com/photo-1594221708779-94832f4320d1?auto=format&fit=crop&w=800&q=80",
          displayOrder: 3,
        },
      ],
    },

    {
      id: "sec_com",
      name: "Cơm & Món Mặn",
      displayOrder: 3,
      products: [
        {
          id: "com_01",
          name: "Cơm Tấm Sườn",
          price: 65000,
          description:
            "Sườn cốt lết nướng mật ong, bì thính, chả trứng, mỡ hành.",
          imageUrl:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
          displayOrder: 1,
        },
        {
          id: "com_02",
          name: "Cơm Rang Dưa Bò",
          price: 55000,
          description: "Cơm chiên giòn hạt, dưa cải chua xào thịt bò mềm.",
          imageUrl:
            "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
          displayOrder: 2,
        },
        {
          id: "com_03",
          name: "Cá Kho Tộ",
          price: 85000,
          description:
            "Cá lóc kho tiêu trong tộ đất, ăn kèm cơm trắng nóng hổi.",
          imageUrl:
            "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=800&q=80",
          displayOrder: 3,
        },
      ],
    },

    {
      id: "sec_rau",
      name: "Rau & Canh",
      displayOrder: 4,
      products: [
        {
          id: "rau_01",
          name: "Rau Muống Xào",
          price: 35000,
          description: "Rau muống xanh non xào lửa lớn, tỏi phi thơm lừng.",
          imageUrl:
            "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
          displayOrder: 1,
        },
        {
          id: "rau_02",
          name: "Canh Chua",
          price: 55000,
          description: "Vị chua thanh của me, bông điên điển, cá lóc đồng.",
          imageUrl:
            "https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=800&q=80",
          displayOrder: 2,
        },
      ],
    },

    {
      id: "sec_douong",
      name: "Đồ Uống",
      displayOrder: 5,
      products: [
        {
          id: "drink_01",
          name: "Trà Đào Cam Sả",
          price: 45000,
          description: "Thanh mát, giải nhiệt, có miếng đào giòn.",
          imageUrl:
            "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
          displayOrder: 1,
        },
        {
          id: "drink_02",
          name: "Cà Phê Sữa Đá",
          price: 29000,
          description: "Đậm đà, tỉnh táo. Sử dụng hạt Robusta nguyên chất.",
          imageUrl:
            "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=800&q=80",
          displayOrder: 2,
        },
        {
          id: "drink_03",
          name: "Sinh Tố Bơ",
          price: 40000,
          description: "Bơ sáp dẻo mịn, sữa đặc ngọt ngào.",
          imageUrl:
            "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=800&q=80",
          displayOrder: 3,
        },
        {
          id: "drink_04",
          name: "Nước Ép Cam",
          price: 35000,
          description: "Cam vàng nguyên chất, bổ sung Vitamin C.",
          imageUrl:
            "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
          displayOrder: 4,
        },
      ],
    },

    {
      id: "sec_trangmieng",
      name: "Tráng Miệng",
      displayOrder: 6,
      products: [
        {
          id: "tm_01",
          name: "Bánh Flan",
          price: 15000,
          description: "Mềm mịn, thơm trứng sữa, caramel đắng nhẹ.",
          imageUrl:
            "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80",
          displayOrder: 1,
        },
        {
          id: "tm_02",
          name: "Chè Hạt Sen",
          price: 25000,
          description: "Hạt sen bở tơi, nước đường phèn thanh mát.",
          imageUrl:
            "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
          displayOrder: 2,
        },
      ],
    },
  ],
};
