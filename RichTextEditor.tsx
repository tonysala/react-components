import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { richTextEditorInitOptions } from "@helpers/richTextEditorInitOptions";
import { Button, ButtonVariants } from "@components/Button";

interface RichTextEditorProps {
  disabled?: boolean;
  menubar?: boolean;
  canBeReset?: boolean;
  maxLength?: number;
  onChange: (value: string) => void;
  onReset?: () => void;
  value?: string;
  id?: string;
}

export const RichTextEditor = (props: RichTextEditorProps) => {
  const {
    disabled = false,
    menubar = false,
    canBeReset = true,
    maxLength = 10000,
    onChange,
    onReset,
    value = "",
    id = Math.random().toString(36),
  } = props;

  const editorRef = useRef(null);
  const [count, setCount]: any = useState<number>(0);
  const [editing, setEditing]: any = useState<boolean>(false);

  const apiKey: string = "gaksa4sipx87pl0i0xz33uzu2qodpn45tbew76ulkugej1wu";

  const onInit = (_: any, editor: any) => {
    setCount(editor.getContent({ format: "html" }).length);
    editorRef.current = editor;
  };

  const handleReset = () => {
    onReset?.();
  }

  const options = richTextEditorInitOptions({ menubar: menubar ?? false });

  return (
    <>
      {editing ? (
        <>
          <div
            id={`modal-${id}`}
            className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-40"
          >
            <div className="w-11/12 bg-white rounded-lg p-14 h-5/6">
              <Editor
                onEditorChange={(content: string, editor: any) => {
                  onChange(content);
                  setCount(editor.getContent({ format: "html" }).length);
                  editorRef.current = editor;
                }}
                disabled={disabled}
                id={id}
                apiKey={apiKey}
                onInit={onInit}
                value={value}
                init={options}
              />
              <p className="text-sm text-gray-600">
                Remaining HTML Characters:
                <span className={count > maxLength ? "text-red-400" : ""}>
                  {maxLength - count}*
                </span>
              </p>
              <div className={"flex gap-2"}>
                <Button variant={ButtonVariants.SUCCESS} onClick={() => setEditing(false)}>
                  Done
                </Button>
                {canBeReset && (
                  <Button variant={ButtonVariants.DANGER} onClick={() => handleReset()}>
                    Undo
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <div
            dangerouslySetInnerHTML={{ __html: value ?? "" }}
            onClick={() => !disabled ?? setEditing(true)}
            onBlur={() => setEditing(false)}
            className={
              "h-48 overflow-auto rounded-lg border-2 p-2" + (disabled ? " bg-gray-200" : "")
            }
          />
          {!disabled ? (
            <div className={"flex gap-2"}>
              <Button variant={ButtonVariants.INFO} onClick={() => setEditing(true)}>
                Edit
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
};
