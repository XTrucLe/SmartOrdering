import { Input } from "@/components/ui/input";
import { useCartStore } from "../cart.store";

export const CustomerInfo = () => {
  const { customer, setCustomer } = useCartStore();

  const handleChange = (field: "name" | "phoneNumber", value: string) => {
    setCustomer({
      ...customer,
      [field]: value,
    });
  };

  return (
    <div className="flex w-full flex-col md:flex-row md:items-center md:justify-around md:gap-0.5 p-1">
      <Input
        placeholder="Tên khách hàng"
        value={customer?.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
        className="flex-1 h-4 mb-2 md:mb-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />

      <Input
        placeholder="Số điện thoại"
        value={customer?.phoneNumber || ""}
        onChange={(e) => handleChange("phoneNumber", e.target.value)}
        className="flex-1 h-4 mt-2 md:mt-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};
