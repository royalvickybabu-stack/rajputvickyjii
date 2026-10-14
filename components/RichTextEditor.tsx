
"use client";

import { useEffect, useRef, useState } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const buttonClass =
  "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-700";

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "यहाँ पूरी खबर लिखें...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || document.activeElement === editor) return;

    if (editor.innerHTML !== value) {
      editor.innerHTML = value || "";
    }
  }, [value]);

  function runCommand(
    command: string,
    commandValue?: string
  ) {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    document.execCommand(command, false, commandValue);
    onChange(editor.innerHTML);
  }

  function addLink() {
    const url = linkUrl.trim();
    if (!url) return;

    try {
      const parsed = new URL(url);
      if (!["http:", "https:", "mailto:"].includes(parsed.protocol)) {
        alert("कृपया सही web link डालें।");
        return;
      }
    } catch {
      alert("कृपया पूरा link डालें, जैसे https://example.com");
      return;
    }

    runCommand("createLink", url);
    setLinkUrl("");
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b bg-gray-50 p-3">
        <button type="button" className={buttonClass} onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("bold")} title="Bold">
          <strong>B</strong>
        </button>
        <button type="button" className={buttonClass} onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("italic")} title="Italic">
          <em>I</em>
        </button>
        <button type="button" className={buttonClass} onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("underline")} title="Underline">
          <u>U</u>
        </button>

        <select
          className="rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm"
          defaultValue="p"
          aria-label="Text style"
          onChange={(e) => runCommand("formatBlock", e.target.value)}
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="blockquote">Quote</option>
        </select>

        <button type="button" className={buttonClass} onClick={() => runCommand("insertUnorderedList")} title="Bullet list">
          • Bullet
        </button>
        <button type="button" className={buttonClass} onClick={() => runCommand("insertOrderedList")} title="Numbered list">
          1. List
        </button>
        <button type="button" className={buttonClass} onClick={() => runCommand("justifyLeft")} title="Align left">
          ≡ Left
        </button>
        <button type="button" className={buttonClass} onClick={() => runCommand("justifyCenter")} title="Center">
          ≡ Center
        </button>
        <button type="button" className={buttonClass} onClick={() => runCommand("justifyRight")} title="Align right">
          ≡ Right
        </button>
        <button type="button" className={buttonClass} onClick={() => runCommand("undo")} title="Undo">
          ↶ Undo
        </button>
        <button type="button" className={buttonClass} onClick={() => runCommand("redo")} title="Redo">
          ↷ Redo
        </button>
        <button type="button" className={buttonClass} onClick={() => runCommand("removeFormat")} title="Clear formatting">
          Clear
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b p-3">
        <input
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://example.com"
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          aria-label="Link URL"
        />
        <button type="button" className={buttonClass} onClick={addLink}>
          Add link to selection
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => setPreview((current) => !current)}
        >
          {preview ? "Edit" : "Preview"}
        </button>
      </div>

      {preview ? (
        <div
          className="prose max-w-none p-4 text-gray-800"
          dangerouslySetInnerHTML={{ __html: value || "<p>Preview यहाँ दिखाई देगा।</p>" }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label="Full news content"
          aria-multiline="true"
          data-placeholder={placeholder}
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          className="min-h-72 whitespace-normal px-4 py-4 text-base leading-8 text-gray-800 outline-none empty:before:text-gray-400 empty:before:content-[attr(data-placeholder)]"
        />
      )}
      <p className="border-t bg-gray-50 px-4 py-2 text-xs text-gray-500">
        Formatting के लिए text चुनें, फिर ऊपर button दबाएँ। Preview से खबर जाँचें।
      </p>
    </div>
  );
}