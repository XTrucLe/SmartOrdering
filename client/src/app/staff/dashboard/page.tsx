export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <main className="max-w-7xl mx-auto w-full h-full p-6 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-blue-500">
              <p className="text-xs text-slate-500 font-bold uppercase">
                Vốn đầu ca
              </p>
              <h3 className="text-2xl font-bold">500.000</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-emerald-500">
              <p className="text-xs text-slate-500 font-bold uppercase">
                Doanh thu ca
              </p>
              <h3 className="text-2xl font-bold">3.240.000</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-amber-500">
              <p className="text-xs text-slate-500 font-bold uppercase">
                Lượt khách
              </p>
              <h3 className="text-2xl font-bold">24</h3>
            </div>
          </div>

          {/* Bảng đơn hàng nằm dưới 3 thẻ */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1">
            <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-bold text-slate-700">
                Các đơn hàng vừa thực hiện
              </h2>
              <span className="text-xs text-blue-600 cursor-pointer hover:underline">
                Xem tất cả
              </span>
            </div>
            <div className="p-6 min-h-0 h-full flex flex-col gap-3 overflow-y-auto">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                >
                  <div>
                    <p className="font-bold text-sm">Đơn hàng #POS-00{item}</p>
                    <p className="text-xs text-slate-400">14:30 - Tiền mặt</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">155.000đ</p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase">
                      Đã thanh toán
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* CỘT PHẢI (HẸP) - Chứa Chi tiết ca và Ghi chú */}
        <aside className="w-full lg:w-80 flex flex-col gap-6">
          {/* Phần Chi tiết ca */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-bold text-sm mb-4 text-slate-800 uppercase tracking-wider">
              Chi tiết ca
            </h3>
            <div className="space-y-4 px-4">
              <div className="flex-1 flex-row gap-4 flex-wrap md:flex-nowrap flex justify-between ">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-medium">
                    Bắt đầu
                  </span>
                  <span className="font-bold text-sm text-slate-700">
                    08:00 AM
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-medium">
                    Dự kiến kết thúc
                  </span>
                  <span className="font-bold text-sm text-slate-700">
                    16:00 PM
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-medium">
                  Nhân viên trực
                </span>
                <span className="font-bold text-sm text-slate-700">
                  Nguyễn Văn A
                </span>
              </div>
              <button className="w-full mt-3 py-2.5 border-red-600 text-red-500 rounded-xl text-xs font-bold hover:bg-red-200 shadow-md transition-all">
                KẾT THÚC CA
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex-1">
            <h3 className="text-slate-700 font-bold text-sm mb-3 uppercase tracking-wider">
              Ghi chú ca
            </h3>
            <textarea
              className="w-full h-48 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs focus:ring-1 focus:ring-blue-400 focus:outline-none resize-none transition-all"
              placeholder="Bàn giao công việc cho ca sau..."
            />
            <button className="w-full mt-3 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md transition-all">
              LƯU THÔNG TIN
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
