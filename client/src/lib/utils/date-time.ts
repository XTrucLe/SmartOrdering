export const formatDate = (
    dateString: string,
    options?: Intl.DateTimeFormatOptions,
) => {
    const date = new Date(dateString.replace(/Z$/, ""));

    return new Intl.DateTimeFormat("vi-VN",
        options
    ).format(date);
};
export const toNow = (
    dateString: string,
    unit: "minutes" | "hours" | "days" = "minutes",
): number => {
    const diff = Date.now() - new Date(dateString.replace(/Z$/, "")).getTime();

    const map = {
        minutes: 60 * 1000,
        hours: 60 * 60 * 1000,
        days: 24 * 60 * 60 * 1000,
    };

    return Math.floor(diff / map[unit]);
};

export const timeAgo = (dateString: string) => {
    const date = new Date(dateString.replace(/Z$/, ""));
    const now = Date.now();

    const diffInSeconds = Math.floor((now - date.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat("vi-VN", {
        numeric: "auto",
    });

    if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, "second");
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return rtf.format(-diffInMinutes, "minute");
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return rtf.format(-diffInHours, "hour");
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return rtf.format(-diffInDays, "day");
};