import { Order } from "../types";
import OrderCard from "./OrderCard";

function OrderList({ orders }: { orders: Order[] }) {
  return (
    <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 overflow-y-auto custom-scrollbar p-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

export default OrderList;
