import { useSearchParams, useRouter } from "next/navigation";

interface StateProps<T> {
  key: string;
  defaultValue: T;
  prase: (val: string | null) => T;
  serialize: (val: T) => string | null;
}

export function useQueryState<T>({
  key,
  defaultValue,
  prase,
  serialize,
}: StateProps<T>) {
  const param = useSearchParams();
  const router = useRouter();

  const val = prase(param.get(key)) ?? defaultValue;

  const setVal = (newVal: T) => {
    const newParams = new URLSearchParams(param);
    const serialized = serialize(newVal);

    if (serialized === null || serialized === "") newParams.delete(key);
    else newParams.set(key, serialized);

    router.push(`?${newParams.toString()}`, {
      scroll: false,
    });
  };

  return [val, setVal] as const;
}
