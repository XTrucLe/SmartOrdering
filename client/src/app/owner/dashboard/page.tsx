"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Store,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Doanh thu hôm nay"
          value="12.450.000đ"
          trend="up"
          percent="+12%"
          icon={<DollarSign size={18} />}
        />
        <StatCard
          title="Đơn hàng"
          value="248"
          trend="up"
          percent="+8%"
          icon={<ShoppingCart size={18} />}
        />
        <StatCard
          title="Khách hàng"
          value="1.024"
          trend="down"
          percent="-3%"
          icon={<Users size={18} />}
        />
        <StatCard
          title="Cửa hàng hoạt động"
          value="8"
          trend="up"
          percent="+1"
          icon={<Store size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Doanh thu theo ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60 flex items-center justify-center text-muted-foreground">
              (Chart placeholder)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full">+ Tạo sản phẩm</Button>
            <Button variant="outline" className="w-full">
              + Tạo danh mục
            </Button>
            <Button variant="outline" className="w-full">
              + Tạo cửa hàng
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {["Trà sữa", "Cà phê", "Bánh mì"].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{item}</span>
                  <span>{70 - i * 10}%</span>
                </div>
                <Progress value={70 - i * 10} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                <div>
                  <p className="font-medium">Order #{1000 + i}</p>
                  <p className="text-xs text-muted-foreground">2 phút trước</p>
                </div>
                <Badge variant={i % 2 === 0 ? "default" : "secondary"}>
                  {i % 2 === 0 ? "Hoàn thành" : "Đang xử lý"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, percent, icon }: any) {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{title}</span>
          {icon}
        </div>

        <div className="text-xl font-bold">{value}</div>

        <div className="flex items-center gap-1 text-xs">
          {trend === "up" ? (
            <TrendingUp className="text-emerald-500" size={14} />
          ) : (
            <TrendingDown className="text-red-500" size={14} />
          )}
          <span
            className={trend === "up" ? "text-emerald-500" : "text-red-500"}
          >
            {percent}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
