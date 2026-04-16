export const formatDate = (dateString: string, options?: {
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
    timeStyle?: 'full' | 'long' | 'medium' | 'short';
}) => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('vi-VN', options);
    return formatter.format(date);
};
