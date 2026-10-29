
"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "यहाँ पूरी खबर लिखें...",
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const savedPositionRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        "aria-label": placeholder,
        class:
          "min-h-[220px] w-full rounded-md border border-gray-300 bg-white p-3 text-sm leading-7 text-gray-900 outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();
    const incoming = value || "";

    if (incoming !== current) {
      editor.commands.setContent(incoming || "", {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  async function handleInlineImage(file: File | undefined) {
    if (!file || !editor) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("केवल JPG, PNG, WEBP या GIF image जोड़ें।");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image का size 5 MB से अधिक नहीं होना चाहिए।");
      return;
    }

    setImageUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Image upload नहीं हुई।");
      }

      const maxPosition = editor.state.doc.content.size;
      const savedPosition = Math.min(
        savedPositionRef.current ?? editor.state.selection.from,
        maxPosition
      );

      editor
        .chain()
        .focus()
        .setTextSelection(savedPosition)
        .setImage({
          src: data.url,
          alt: file.name,
        })
        .run();

      savedPositionRef.current = null;
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Image upload करने में समस्या हुई।"
      );
    } finally {
      setImageUploading(false);

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  }

  if (!mounted || !editor) {
    return (
      <div className="min-h-[220px] rounded-md border border-gray-300 bg-white p-3 text-sm text-gray-500">
        Editor loading...
      </div>
    );
  }

  const buttonClass = (active: boolean) =>
    `rounded border px-3 py-1.5 text-sm ${
      active
        ? "border-gray-800 bg-gray-800 text-white"
        : "border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
    }`;

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={buttonClass(editor.isActive("bold"))}
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
        >
          B
        </button>

        <button
          type="button"
          className={buttonClass(editor.isActive("italic"))}
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
        >
          <i>I</i>
        </button>

        <button
          type="button"
          className={buttonClass(
            editor.isActive("heading", { level: 2 })
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>

        <button
          type="button"
          className={buttonClass(
            editor.isActive("heading", { level: 3 })
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </button>

        <button
          type="button"
          className={buttonClass(editor.isActive("bulletList"))}
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          • List
        </button>

        <button
          type="button"
          className={buttonClass(editor.isActive("orderedList"))}
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          1. List
        </button>

        <button
          type="button"
          className={buttonClass(false)}
          disabled={imageUploading}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            savedPositionRef.current = editor.state.selection.from;
            imageInputRef.current?.click();
          }}
        >
          {imageUploading
            ? "Image Upload हो रही है..."
            : "📷 खबर के बीच में Image जोड़ें"}
        </button>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          hidden
          onChange={(event) => {
            void handleInlineImage(event.target.files?.[0]);
          }}
        />

        <button
          type="button"
          className={buttonClass(false)}
          onClick={() =>
            editor.chain().focus().unsetAllMarks().run()
          }
        >
          Clear formatting
        </button>
      </div>

      <p className="text-xs text-gray-500">
        पहले खबर में जहाँ image चाहिए वहाँ cursor रखें, फिर image जोड़ें।
        एक खबर में कई images लगा सकते हैं।
      </p>

      <EditorContent editor={editor} />

      <style jsx global>{`
        .tiptap p {
          margin: 0 0 0.75rem;
        }

        .tiptap h2 {
          font-size: 1.35rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem;
        }

        .tiptap h3 {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0.75rem 0 0.5rem;
        }

        .tiptap ul {
          list-style: disc;
          padding-left: 1.5rem;
        }

        .tiptap ol {
          list-style: decimal;
          padding-left: 1.5rem;
        }

        .tiptap strong {
          font-weight: 700;
        }

        .tiptap em {
          font-style: italic;
        }

        .tiptap img {
          display: block;
          max-width: 100%;
          height: auto;
          margin: 1rem auto;
          border-radius: 0.5rem;
        }

        .tiptap:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}
