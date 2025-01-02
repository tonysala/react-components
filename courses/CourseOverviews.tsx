import React from "react";
import { RichTextEditor } from "@components/RichTextEditor";
import { KeyComponentProps, KeyValue, MasterDetail, ValueComponentProps } from "@components/MasterDetail";
import { useCurrentUser } from "@context/UserContext";
import { Input } from "@components/Input";
import CourseOverview from "../../../interfaces/CourseOverview";

interface CourseOverviewsProps {
  value?: CourseOverview[];
  onUpdate: (value: KeyValue[]) => void;
}

const format = (items: any) => {
  return items.map((item: any) => {
    const object = {
      id: item.id,
      key: item.head,
      value: item.body,
    }
    return { ...object, original: object }
  });
};

const limits = {
  key: 150,
  value: 30000,
  count: 100,
};

export const CourseOverviews = (props: CourseOverviewsProps) => {
  const { value, onUpdate } = props;

  return (
    <>
      <MasterDetail<KeyValue>
        KeyComponent={Key}
        ValueComponent={Value}
        items={format(value)}
        setItems={(value) => onUpdate(value)}
        template={{ id: "", key: "", value: "" }}
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
      <div className="flex-1 flex-col">
        <Input
          value={items[index].head}
          onChange={(value: string) => update(value)}
          clearable={false}
          limit={{ show: true, characters: limits.key }}
        />
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

  return (
    <>
      <RichTextEditor
        onChange={(value) => update(value)}
        value={items[selected]?.body}
        menubar={hasRole("super admin") || hasRole("course admin")}
        disabled={!hasPermission("course:update:course_overviews")}
        maxLength={limits.value}
        onReset={() => actions.reset(selected)}
        canBeReset={items[selected]?.original?.body !== items[selected]?.body}
      />
    </>
  )
}
