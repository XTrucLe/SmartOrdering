export type FilterOption = {
    label: string;
    value: string;
};

export type FilterConfigItem =
    | {
        type: "checkbox";
        key: string;
        label: string;
        options: FilterOption[];
    }
    | {
        type: "radio";
        key: string;
        label: string;
        options: FilterOption[];
    };