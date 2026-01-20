import React from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { File } from "lucide-react";

type EmptyPageProps = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

function EmptyPage({
  title = "Không có nội dung",
  description = "Không có nội dung để hiển thị ở đây. Hãy thử lại sau.",
  icon,
  children,
}: EmptyPageProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon ?? <File />}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {children && <EmptyContent>{children}</EmptyContent>}
    </Empty>
  );
}

export default EmptyPage;
