import React from "react";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES_WITH_KEY_VALUES } from "@services/graphQL/queries/categories";
import Select from "react-select";
import { Tag, TagVariants } from "@components/Tag";
import { Option } from "@components/Select";

interface KeyValuePair {
  title: string;
  value: string;
}

interface Category {
  id: string;
  name: string;
  parent: Category;
  kvp: KeyValuePair[];
}

interface CategoryPickerProps {
  value: any;
  disabled?: boolean;
  onChange: (selected: any) => void;
  multiple?: boolean;
  maximum?: number;
  exclude?: string[];
}

export const CategoryPicker = (props: CategoryPickerProps) => {
  const {
    value = null,
    disabled = false,
    onChange,
    multiple = false,
    maximum,
    exclude = [],
  } = props;

  const { loading, data } = useQuery(GET_CATEGORIES_WITH_KEY_VALUES);

  if (loading) return (
    <>
      <Select
        isDisabled={true}
        className="relative block w-full text-sm"
        value={{label: "Loading...", value: null}}
        options={[]}
      />
    </>
  );

  const results = data.categories
    .filter((item: Category) => !exclude.includes(item.id))
    .map((item: Category) => ({ value: item.id, label: item.name, parent: item.parent?.name, kvp: item?.kvp ?? [] }));

  const Result = (props: any) => {
    const { data, selectOption } = props;

    return (
      <div
        className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-200 text-sm"
        onClick={() => {
          if (multiple) {
            if (maximum && value.length >= maximum) {
              return;
            }
            selectOption(data);
            const list = [...value, data.value];
            const selected = results.filter((v: any) => list.includes(v.value));
            onChange(selected);
          } else {
            selectOption(data);
            onChange(data);
          }
        }}
      >
        <div className="flex flex-col">
          <div className={"text-sm"}>{data.label}</div>
          <div className={"text-2xs uppercase text-gray-400"}>{data.parent ?? "top level"}</div>
        </div>
        <div className="flex flex-row">
          {data.kvp?.map((kvp: KeyValuePair) => <Tag variant={TagVariants.INFO}>{kvp.title} - {kvp.value}</Tag>)}
        </div>
      </div>
    );
  };

  return (
    <>
      <Select
        components={{ Option: Result }}
        isDisabled={disabled}
        className="relative block w-full text-sm"
        value={multiple ? results.filter((v: any) => value.includes(v.value)) : results.find((r: Option) => r.value === value)}
        options={results}
        closeMenuOnSelect={!multiple}
        isClearable={true}
        onChange={(option) => onChange(option)}
        isMulti={multiple}
      />
    </>
  );
};