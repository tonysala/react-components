import React from "react";
import { KeyComponentProps, KeyValue, MasterDetail, ValueComponentProps } from "@components/MasterDetail";
import { useCurrentUser } from "@context/UserContext";
import { Input } from "@components/Input";
import KeyDetail from "../../../interfaces/KeyDetail";

interface KeyDetailsProps {
  value?: KeyDetail[];
  onUpdate: (value: KeyValue[]) => void;
}

const format = (items: any) => {
  return items.map((item: any) => {
    const object = {
      id: item.id,
      key: item.title,
      value: item.value,
    }
    return { ...object, original: object }
  });
};

const limits = {
  key: 50,
  value: 300,
  count: 7,
};

export const KeyDetails = (props: KeyDetailsProps) => {
  const { value, onUpdate } = props;

  return (
    <>
      <MasterDetail<KeyValue>
        KeyComponent={Key}
        ValueComponent={Value}
        items={format(value)}
        setItems={(value: KeyValue[]) => onUpdate(value)}
        template={{ id: "", key: "", value: "" }}
      />
    </>
  );
};

const Key = ({ items, setItems, index, actions }: KeyComponentProps) => {
  const update = (value: string): void => {
    setItems((previous: any) => {
      const updated = [...previous];
      updated[index] = { ...updated[index], title: value };
      return updated;
    });
  };
  return (
    <div className="flex gap-2 p-4 rounded">
      <div className="flex items-center w-4">
        <span className="flex text-sm text-center text-gray-500">&#x2630;</span>
      </div>
      <div className="flex-1 flex-col">
        <Input
          value={items[index]?.title}
          onChange={(value: string) => update(value)}
          clearable={false}
          limit={{ show: true, characters: limits.key }}
        />
      </div>
      <div
        className="flex items-center w-4 cursor-pointer"
        onClick={() => setItems(items.filter((_, i) => i !== index))}
      >
        <span className="flex text-2xl text-center text-gray-500">&#x2715;</span>
      </div>
    </div>
  );
};

const Value = ({ items, setItems, selected }: ValueComponentProps) => {
  const { hasPermission } = useCurrentUser();
  const update = (value: string): void => {
    setItems((previous: any) => {
      const updated = [...previous];
      updated[selected] = { ...updated[selected], value: value };
      return updated;
    });
  };

  return (
    <>
      <Input
        value={items[selected]?.value ?? ""}
        onChange={(value: string) => update(value)}
        clearable={false}
        limit={{ show: true, characters: limits.key }}
        disabled={!items[selected] || !hasPermission("course:update:key_details")}
      />
    </>
  );
};
