export const formatString = (str: string, maxLength: number = -1) => {
    if (maxLength > 0 && str.length > maxLength) {
        return str.slice(0, maxLength) + '...';
    }
    return str;
}

export const toTitleCase = (str: string) => {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export const toSentenceCase = (str: string) => {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const toKebabCase = (str: string) => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\s+/g, '-')
        .toLowerCase();
}

export const toSnakeCase = (str: string) => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/\s+/g, '_')
        .toLowerCase();
}

export const toCamelCase = (str: string) => {
    return str
        .toLowerCase()
        .split(/[\s_-]+/)
        .map((word, index) => {
            if (index === 0) return word;
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
        ).join('');
}