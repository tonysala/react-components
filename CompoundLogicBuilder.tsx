import React from "react";
import { Button, ButtonVariants } from "./Button";
import { CriteriaType, Group, Rule } from "../collections/types";
import { MODELS } from "../collections/constants";
import { Alert, AlertVariants } from "./Alert";

interface CompoundLogicBuilderProps {
  criteria: Group;
  onChange?: (criteria: Group) => void;
  models: string[];
  disabled?: boolean;
}

export const CompoundLogicBuilder = (props: CompoundLogicBuilderProps) => {
  const {
    onChange,
    models,
    disabled = false,
  } = props;

  if (models.length === 0) {
    return <Alert variant={AlertVariants.DANGER}>You must select at least one type.</Alert>;
  }

  const field = MODELS[models[0]].field;

  const elements = {
    RULE: { type: "RULE", field: field, operand: "=", value: [] } as Rule,
    GROUP: { type: "GROUP", operand: "AND", conditions: [] } as Group,
  };

  const criteria = props.criteria ? [props.criteria] : [elements.GROUP];

  const actions = {
    get: (path: number[]): Group | Rule | null => {
      let target: (Rule | Group)[] = criteria;
      for (let i = 0; i < path.length; i++) {
        const idx = path[i];
        if (i < path.length - 1) {
          target = (target[idx] as Group).conditions;
        } else {
          return target[idx] ?? null;
        }
      }
      return null;
    },
    add: (path: number[], type: CriteriaType) => {
      const conditions = [...criteria];
      let target: (Group | Rule)[] = conditions;
      for (let i = 0; i < path.length; i++) {
        const idx = path[i];
        target[idx] = { ...target[idx] };
        if (i === path.length - 1) {
          (target[idx] as Group).conditions = [...(target[idx] as Group).conditions, elements[type]];
        } else {
          (target[idx] as Group).conditions = [...(target[idx] as Group).conditions];
          target = (target[idx] as Group).conditions;
        }
      }
      onChange && onChange(conditions[0]);
    },
    remove: (path: number[]) => {
      const conditions = [...criteria];
      let target: (Group | Rule)[] = conditions;
      for (let i = 0; i < path.length; i++) {
        const idx = path[i];
        if (i === path.length - 1) {
          target.splice(idx, 1);
        } else {
          target[idx] = { ...target[idx] };
          (target[idx] as Group).conditions = [...(target[idx] as Group).conditions];
          target = (target[idx] as Group).conditions;
        }
      }
      onChange && onChange(conditions[0]);
    },
    update: (path: number[], item: any) => {
      const conditions = [...criteria];
      let target: (Group | Rule)[] = conditions;

      for (let i = 0; i < path.length; i++) {
        const idx = path[i];
        if (i === path.length - 1) {
          target[idx] = item;
        } else {
          target[idx] = { ...target[idx] };
          (target[idx] as Group).conditions = [...(target[idx] as Group).conditions];
          target = (target[idx] as Group).conditions;
        }
      }
      onChange && onChange(conditions[0]);
    },
  };

  return (
    <div>
      <Group
        path={[0]}
        operand={criteria[0].operand}
        conditions={criteria[0].conditions}
        actions={actions}
        models={models}
        disabled={disabled}
      />
    </div>
  );
};

const Rule = ({ path, value, actions, models, disabled, operand }: any) => {
  const Child = MODELS[models[0]].rule;

  const operands: {
    [key: string]: any
  } = {
    "=": {
      label: "WHERE HAS",
      color: "blue",
    },
    "<>": {
      label: "WHERE HAS NOT",
      color: "red",
    },
  };

  const toggle = () => {
    actions.update(path, { ...actions.get(path), operand: operand === "=" ? "<>" : "=" });
  };

  return (
    <div
      className={`flex bg-${operands[operand].color}-100 p-2 ml-8 gap-2 border-2 border-${operands[operand].color}-200 rounded items-center`}>
      {/* tree-shake: text-blue-600 bg-blue-100 border-blue-200 text-red-600 bg-red-100 border-red-200 */}
      <span
        className={`font-bold text-${operands[operand].color}-600 whitespace-nowrap underline cursor-pointer`}
        onClick={() => !disabled && toggle()}
      >
        {operands[operand].label}
      </span>
      <Child path={path} value={value} actions={actions} disabled={disabled} />
      {!disabled && (
        <Button variant={ButtonVariants.DANGER} onClick={() => actions.remove(path)}>×</Button>
      )}
    </div>
  );
};

const Group = ({ path, operand, conditions, actions, models, disabled }: any) => {

  const operands: {
    [key: string]: any
  } = {
    "AND": {
      label: "ALL OF",
      color: "yellow",
    },
    "OR": {
      label: "ANY OF",
      color: "green",
    },
  };

  const toggle = () => {
    actions.update(path, { ...actions.get(path), operand: operand === "AND" ? "OR" : "AND" });
  };

  return (
    <div className={`flex flex-col bg-${operands[operand].color}-100 border-${operands[operand].color}-200 p-2 ${path.length > 1 ? "ml-8" : ""} gap-2 rounded border-2`}>
      {/* tree-shake: bg-green-100 border-green-200 text-green-600 bg-yellow-100 border-yellow-200 text-yellow-600 */}
      <div className="flex items-center gap-2 w-full">
        <span
          className={`font-bold whitespace-nowrap text-${operands[operand].color}-600 underline cursor-pointer`}
          onClick={() => !disabled && toggle()}
        >
          {operands[operand].label}
        </span>
        {(path.length > 1 && !disabled) && (
          <Button variant={ButtonVariants.DANGER} onClick={() => actions.remove(path)}>×</Button>
        )}
      </div>
      {conditions.map((condition: any, index: number) => {
        const currentPath = [...path, index];
        return <div className="flex flex-col gap-2" key={index}>
          {condition.type === "RULE" ? (
            <Rule
              key={currentPath.join("-")}
              {...condition}
              path={currentPath}
              actions={actions}
              models={models}
              disabled={disabled}
            />
          ) : (
            <Group
              key={currentPath.join("-")}
              {...condition}
              path={currentPath}
              actions={actions}
              models={models}
              disabled={disabled}
            />
          )}
          {index < (conditions.length - 1) && (
            <span className={`ml-8 p-2 text-sm text-${operands[operand].color}-600`}>
              - {operand} -
            </span>
          )}
        </div>;
      })}
      {!disabled && (
        <div className="flex flex-row gap-2">
          <Button variant={ButtonVariants.SUCCESS} onClick={() => actions.add(path, "RULE")}>+ Rule</Button>
          <Button variant={ButtonVariants.SUCCESS} onClick={() => actions.add(path, "GROUP")}>+ Group</Button>
        </div>
      )}
    </div>
  );
};
