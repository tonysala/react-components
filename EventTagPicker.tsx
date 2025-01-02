import React from "react";
import { useQuery } from "@apollo/client";
import { GET_EVENT_TAGS } from "../services/graphQL/queries/events";
import { LoadingSpinner } from "./LoadingSpinner";
import Select from "react-select";
import { Option } from "./Select";

interface EventTag {
  id: string;
  name: string;
}

interface EventTagPickerProps {
  value: any;
  disabled?: boolean;
  onChange: (selected: any) => void;
  multiple?: boolean;
  maximum?: number;
  exclude?: string[];
}

export const EventTagPicker = (props: EventTagPickerProps) => {
  const {
    value = null,
    disabled = false,
    onChange,
    multiple = false,
    maximum,
    exclude = [],
  } = props;

  const { loading, data } = useQuery(GET_EVENT_TAGS);

  if (loading) return <LoadingSpinner show={true} />;

  const results = data.eventTags
    .filter((item: EventTag) => !exclude.includes(item.id))
    .map((item: EventTag) => ({ value: item.id, label: item.name }));

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
          <div className={"text-2xs uppercase text-gray-400"}>{data.category ?? "top level"}</div>
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