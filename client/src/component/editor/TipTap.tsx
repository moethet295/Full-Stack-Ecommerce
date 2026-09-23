import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";

interface TipTapProps {
  value: string;
  onChange: (value: string) => void;
}

const TipTap = ({ value, onChange }: TipTapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    content: value,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap gap-2 border-b border-gray-300 pb-3">

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          className={`rounded-md border border-gray-300 px-3 py-1 font-bold ${
          editor.isActive("bold")
            ? "bg-gray-200"
            : "bg-white hover:bg-gray-100"
        }`}
        >
          B
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          className={`rounded-md border border-gray-300 px-3 py-1 italic ${
            editor.isActive("italic")
              ? "bg-black text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          I
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().setTextAlign("left").run()
          }
          className={`rounded-md border border-gray-300 px-3 py-1 ${
            editor.isActive({ textAlign: "left" })
              ? "bg-black text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Left
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().setTextAlign("center").run()
          }
          className={`rounded-md border border-gray-300 px-3 py-1 ${
            editor.isActive({ textAlign: "center" })
              ? "bg-black text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Center
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().setTextAlign("right").run()
          }
          className={`rounded-md border border-gray-300 px-3 py-1 ${
            editor.isActive({ textAlign: "right" })
              ? "bg-black text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Right
        </button>

      </div>

      {/* Writing Area */}
      <EditorContent
        editor={editor}
        className="min-h-[110px] outline-none"
      />
    </div>
  );
};

export default TipTap;