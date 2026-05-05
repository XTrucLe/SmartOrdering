import { Dialog, DialogContent } from "@/components/ui/dialog";

export const TakeAwayForm = ({
  form,
  setForm,
}: {
  form: { name: string; phone: string };
  setForm: (form: { name: string; phone: string }) => void;
}) => {
  return (
    <Dialog>
      <DialogContent className="max-w-md">
        <h2 className="text-lg font-semibold mb-4">Thêm đơn mang về</h2>
        {/* Form fields for take away order */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Tên khách hàng
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Nhập tên khách hàng"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Nhập số điện thoại"
              value={form.phone}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Tạo đơn hàng
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
