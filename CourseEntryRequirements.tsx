import React from "react";
import { RichTextEditor } from "@components/RichTextEditor";
import EntryRequirement from "../../interfaces/EntryRequirement";
import { KeyComponentProps, KeyValue, MasterDetail, ValueComponentProps } from "@components/MasterDetail";
import Toggle from "@components/Toggle";
import { useCurrentUser } from "@context/UserContext";
import { Input } from "@components/Input";

interface CourseEntryRequirementsProps {
  value: EntryRequirement[];
  onUpdate: (value: KeyValue[]) => void;
}

const format = (items: any) => {
  return items.map((item: any) => {
    const object = {
      id: item.id,
      key: item.head,
      value: item.body,
      tab_name: item.tab_name ?? [],
    }
    return { ...object, original: object }
  });
};

const limits = {
  key: 150,
  value: 30000,
  count: 30,
};

export const CourseEntryRequirements = (props: CourseEntryRequirementsProps) => {
  const { value = [], onUpdate } = props;

  return (
    <>
      <MasterDetail<KeyValue>
        KeyComponent={Key}
        ValueComponent={Value}
        items={format(value)}
        setItems={(value) => onUpdate(value)}
        template={{ id: "", key: "", value: "", tab_name: [] }}
      />
    </>
  );
};

const Key = ({ items, setItems, index, actions }: KeyComponentProps) => {
  const update = (value: string): void => {
    setItems((previous: any) => {
      const updated = [...previous];
      updated[index] = { ...updated[index], head: value };
      return updated;
    });
  };
  return (
    <div className="flex gap-2 p-4 rounded">
      <div className="flex items-center w-4">
        <span className="flex text-sm text-center text-gray-500">&#x2630;</span>
      </div>
      <div className="flex-col flex-1">
        <Input
          value={items[index].head}
          onChange={(value: string) => update(value)}
          clearable={false}
          limit={{ show: true, characters: limits.key }}
        />
        <div className="absolute flex gap-4">
          {items[index].tab_name.sort().map((tab: string) => (
            <small className="font-bold text-gray-600 uppercase text-2xs">{tab}</small>
          ))}
        </div>
      </div>
      <div className="flex items-center w-4 cursor-pointer" onClick={() => actions.remove(index)}>
        <span className="flex text-2xl text-center text-gray-500">&#x2715;</span>
      </div>
    </div>
  );
};

const Value = ({ items, setItems, selected, actions }: ValueComponentProps) => {
  const { hasRole, hasPermission } = useCurrentUser();
  const update = (value: string): void => {
    setItems((previous: any) => {
      const updated = [...previous];
      updated[selected] = { ...updated[selected], body: value };
      return updated;
    });
  };

  type Display = "uk" | "international";
  const toggle = (type: Display, value: boolean): void => {
    const updated = [...items];

    if (value) {
      updated[selected].tab_name.push(type);
    } else {
      updated[selected].tab_name = updated[selected].tab_name.filter(
        (item: Display) => item !== type
      );
    }
    setItems(updated);
  };

  return (
    <>
      <RichTextEditor
        onChange={(value) => update(value)}
        value={items[selected]?.body}
        menubar={hasRole("super admin") || hasRole("course admin")}
        disabled={items.length < 1 || !hasPermission("course:update:entry_requirement")}
        maxLength={limits.value}
        onReset={() => actions.reset(selected)}
        canBeReset={items[selected]?.original?.body !== items[selected]?.body}
      />
      <div className="flex gap-8">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 uppercase">UK</span>
          <Toggle
            value={items[selected]?.tab_name.includes("uk")}
            onChange={(value: boolean) => toggle("uk", value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 uppercase">International</span>
          <Toggle
            value={items[selected]?.tab_name.includes("international")}
            onChange={(value: boolean) => toggle("international", value)}
          />
        </div>
      </div>
    </>
  );
};
