export function merge<T extends Record<string, any>>(current: T, newValues: Partial<T>): T {
  const merged: any = { ...current };

  for (const [key, value] of Object.entries(newValues)) {
    const currentValue = merged[key];

    if (isPlainObject(currentValue) && isPlainObject(value)) {
      merged[key] = merge(currentValue, value);
    } else if (value !== undefined) {
      merged[key] = value;
    }
  }

  return merged;
}

function isPlainObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
