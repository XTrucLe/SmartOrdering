import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StateProps<T> {
  key: string;
  defaultValue: T;
  parse: (val: string | null) => T;
  serialize: (val: T) => string | null;
  debounceMs?: number;
}

export function useQueryState<T>({
  key,
  defaultValue,
  parse,
  serialize,
  debounceMs = 300,
}: StateProps<T>) {
  const params = useSearchParams();
  const router = useRouter();

  const initial = parse(params.get(key)) ?? defaultValue;

  const [val, setVal] = useState<T>(initial);

  const updateUrl = (value: T, mode: "push" | "replace") => {
    const newParams = new URLSearchParams(params);
    const serialized = serialize(value);

    if (!serialized) newParams.delete(key);
    else newParams.set(key, serialized);

    const url = `?${newParams.toString()}`;

    router[mode](url, { scroll: false });
  };

  useEffect(() => {
    const t = setTimeout(() => {
      updateUrl(val, "replace");
    }, debounceMs);

    return () => clearTimeout(t);
  }, [val]);

  const onEnter = () => {
    updateUrl(val, "push");
  };

  return [val, setVal, onEnter] as const;
}
