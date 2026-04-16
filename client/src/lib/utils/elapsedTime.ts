export const getElapsedTime = (startTime: Date, endTime: Date): string => {
    const elapsedTime = endTime.getTime() - startTime.getTime();
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    const minutes = Math.floor(elapsedTime / (1000 * 60));
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(elapsedTime / (1000 * 60 * 60 * 24 * 7));
    const months = Math.floor(elapsedTime / (1000 * 60 * 60 * 24 * 30));
    const years = Math.floor(elapsedTime / (1000 * 60 * 60 * 24 * 365));

    if (years > 0) {
        return `${years} năm trước`;
    } else if (months > 0) {
        return `${months} tháng trước`;
    } else if (weeks > 0) {
        return `${weeks} tuần trước`;
    } else if (days > 0) {
        return `${days} ngày trước`;
    } else if (hours > 0) {
        return `${hours} giờ trước`;
    } else if (minutes > 0) {
        return `${minutes} phút trước`;
    } else {
        return `${seconds} giây trước`;
    }
}