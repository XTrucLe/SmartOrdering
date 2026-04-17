import { Order } from "../types";
import OrderCard from "./OrderCard";

function OrderBoard({ orders }: { orders: Order[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 w-full overflow-y-auto custom-scrollbar p-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

export default OrderBoard;
