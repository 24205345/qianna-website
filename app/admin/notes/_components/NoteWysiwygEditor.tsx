"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Markdown } from "@tiptap/markdown";
import {
  Bold,
  Code2,
  Columns3,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Rows3,
  Table2,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  BetweenVerticalStart,
  BetweenVerticalEnd,
  BetweenHorizontalStart,
  BetweenHorizontalEnd,
} from "lucide-react";
import "./tiptap-editor.css";

export interface NoteWysiwygEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onUploadImage?: (file: File) => Promise<string>;
}

function ToolbarButton({
  active,
  danger,
  disabled,
  title,
  onClick,
  children,
}: {
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  title: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`tiptap-toolbar-btn ${active ? "is-active" : ""} ${
        danger ? "is-danger" : ""
      }`}
    >
      {children}
    </button>
  );
}

export default function NoteWysiwygEditor({
  value,
  onChange,
  placeholder = "直接在此书写笔记正文，排版所见即所得…",
  disabled = false,
  className = "",
  onUploadImage,
}: NoteWysiwygEditorProps) {
  const [showMdSource, setShowMdSource] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [inTable, setInTable] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const syncingExternal = useRef(false);
  const lastEmittedMd = useRef(value);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const insertImageFile = useCallback(
    async (file: File) => {
      if (!onUploadImage || disabled) return;
      setUploadingImage(true);
      try {
        const url = await onUploadImage(file);
        if (editor) {
          editor
            .chain()
            .focus()
            .setImage({ src: url, alt: file.name.replace(/\.[^.]+$/, "") })
            .run();
        }
      } catch (err) {
        window.alert(
          err instanceof Error ? err.message : "图片上传失败，请重试"
        );
      } finally {
        setUploadingImage(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onUploadImage, disabled]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class:
            "text-stone-900 underline decoration-stone-300 underline-offset-4",
        },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Markdown,
    ],
    content: value,
    contentType: "markdown",
    editable: !disabled,
    editorProps: {
      handlePaste: (_view, event) => {
        const files = event.clipboardData?.files;
        if (
          files &&
          files.length > 0 &&
          files[0].type.startsWith("image/") &&
          onUploadImage
        ) {
          void insertImageFile(files[0]);
          return true;
        }
        return false;
      },
      handleDrop: (_view, event) => {
        const files = event.dataTransfer?.files;
        if (
          files &&
          files.length > 0 &&
          files[0].type.startsWith("image/") &&
          onUploadImage
        ) {
          void insertImageFile(files[0]);
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (syncingExternal.current) return;
      const md = ed.getMarkdown();
      lastEmittedMd.current = md;
      onChangeRef.current(md);
    },
  });

  useEffect(() => {
    if (!editor) return;
    const refreshTableState = () => setInTable(editor.isActive("table"));
    refreshTableState();
    editor.on("selectionUpdate", refreshTableState);
    editor.on("transaction", refreshTableState);
    return () => {
      editor.off("selectionUpdate", refreshTableState);
      editor.off("transaction", refreshTableState);
    };
  }, [editor]);

  useEffect(() => {
    lastEmittedMd.current = value;
  }, [value]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  // 当外部 value 变更（例如切换中/英文正文）时更新编辑器内容
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    if (value === lastEmittedMd.current) return;
    const current = editor.getMarkdown();
    if (value === current) {
      lastEmittedMd.current = value;
      return;
    }
    syncingExternal.current = true;
    editor.commands.setContent(value, {
      contentType: "markdown",
      emitUpdate: false,
    });
    lastEmittedMd.current = value;
    syncingExternal.current = false;
  }, [editor, value]);

  const run = useCallback(
    (fn: () => boolean) => {
      if (!editor || disabled) return;
      fn();
    },
    [editor, disabled]
  );

  const handleSetLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("请输入链接地址", prev ?? "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  }, [editor]);

  if (!editor) {
    return (
      <div className={`tiptap-editor-shell items-center justify-center p-8 text-sm text-stone-400 ${className}`}>
        加载编辑器中…
      </div>
    );
  }

  const tbDisabled = disabled || uploadingImage;

  return (
    <div className={`tiptap-editor-shell ${className}`}>
      {/* 顶部吸顶富文本工具栏 */}
      <div className="tiptap-editor-toolbar">
        <ToolbarButton
          title="撤销 (Ctrl+Z)"
          disabled={tbDisabled || !editor.can().undo()}
          onClick={() => run(() => editor.chain().focus().undo().run())}
        >
          <Undo2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="重做 (Ctrl+Y)"
          disabled={tbDisabled || !editor.can().redo()}
          onClick={() => run(() => editor.chain().focus().redo().run())}
        >
          <Redo2 size={16} />
        </ToolbarButton>

        <span className="sep" />

        <ToolbarButton
          title="二级标题 (##)"
          active={editor.isActive("heading", { level: 2 })}
          disabled={tbDisabled}
          onClick={() =>
            run(() => editor.chain().focus().toggleHeading({ level: 2 }).run())
          }
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="三级标题 (###)"
          active={editor.isActive("heading", { level: 3 })}
          disabled={tbDisabled}
          onClick={() =>
            run(() => editor.chain().focus().toggleHeading({ level: 3 }).run())
          }
        >
          <Heading3 size={16} />
        </ToolbarButton>

        <span className="sep" />

        <ToolbarButton
          title="加粗 (Ctrl+B)"
          active={editor.isActive("bold")}
          disabled={tbDisabled}
          onClick={() => run(() => editor.chain().focus().toggleBold().run())}
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="斜体 (Ctrl+I)"
          active={editor.isActive("italic")}
          disabled={tbDisabled}
          onClick={() => run(() => editor.chain().focus().toggleItalic().run())}
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="引用块 (>)"
          active={editor.isActive("blockquote")}
          disabled={tbDisabled}
          onClick={() =>
            run(() => editor.chain().focus().toggleBlockquote().run())
          }
        >
          <Quote size={16} />
        </ToolbarButton>

        <span className="sep" />

        <ToolbarButton
          title="无序列表 (-)"
          active={editor.isActive("bulletList")}
          disabled={tbDisabled}
          onClick={() =>
            run(() => editor.chain().focus().toggleBulletList().run())
          }
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="有序列表 (1.)"
          active={editor.isActive("orderedList")}
          disabled={tbDisabled}
          onClick={() =>
            run(() => editor.chain().focus().toggleOrderedList().run())
          }
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <span className="sep" />

        <ToolbarButton
          title="插入链接"
          active={editor.isActive("link")}
          disabled={tbDisabled}
          onClick={handleSetLink}
        >
          <Link2 size={16} />
        </ToolbarButton>

        <ToolbarButton
          title="插入图片 (支持直接粘贴截图)"
          disabled={tbDisabled || !onUploadImage}
          onClick={() => imageInputRef.current?.click()}
        >
          {uploadingImage ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ImageIcon size={16} />
          )}
        </ToolbarButton>

        <ToolbarButton
          title="代码块 (```)"
          active={editor.isActive("codeBlock")}
          disabled={tbDisabled}
          onClick={() =>
            run(() => editor.chain().focus().toggleCodeBlock().run())
          }
        >
          <Code2 size={16} />
        </ToolbarButton>

        <span className="sep" />

        <ToolbarButton
          title="插入 3×3 表格"
          disabled={tbDisabled}
          onClick={() =>
            run(() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            )
          }
        >
          <Table2 size={16} />
        </ToolbarButton>

        {inTable && (
          <>
            <span className="tiptap-table-label">表格</span>
            <ToolbarButton
              title="在下方增加行"
              disabled={tbDisabled}
              onClick={() => run(() => editor.chain().focus().addRowAfter().run())}
            >
              <BetweenHorizontalEnd size={16} />
            </ToolbarButton>
            <ToolbarButton
              title="在上方增加行"
              disabled={tbDisabled}
              onClick={() =>
                run(() => editor.chain().focus().addRowBefore().run())
              }
            >
              <BetweenHorizontalStart size={16} />
            </ToolbarButton>
            <ToolbarButton
              title="删除当前行"
              danger
              disabled={tbDisabled}
              onClick={() => run(() => editor.chain().focus().deleteRow().run())}
            >
              <Rows3 size={16} />
            </ToolbarButton>
            <ToolbarButton
              title="在右侧增加列"
              disabled={tbDisabled}
              onClick={() =>
                run(() => editor.chain().focus().addColumnAfter().run())
              }
            >
              <BetweenVerticalEnd size={16} />
            </ToolbarButton>
            <ToolbarButton
              title="在左侧增加列"
              disabled={tbDisabled}
              onClick={() =>
                run(() => editor.chain().focus().addColumnBefore().run())
              }
            >
              <BetweenVerticalStart size={16} />
            </ToolbarButton>
            <ToolbarButton
              title="删除当前列"
              danger
              disabled={tbDisabled}
              onClick={() =>
                run(() => editor.chain().focus().deleteColumn().run())
              }
            >
              <Columns3 size={16} />
            </ToolbarButton>
            <ToolbarButton
              title="删除整个表格"
              danger
              disabled={tbDisabled}
              onClick={() =>
                run(() => editor.chain().focus().deleteTable().run())
              }
            >
              <Table2 size={16} />
            </ToolbarButton>
          </>
        )}

        <div className="ml-auto flex items-center">
          <span className="sep" />
          <ToolbarButton
            title={showMdSource ? "返回所见即所得编辑器" : "查看/编辑 Markdown 源码"}
            disabled={disabled}
            onClick={() => setShowMdSource((v) => !v)}
          >
            <span className="flex items-center gap-1 text-xs">
              {showMdSource ? <EyeOff size={15} /> : <Eye size={15} />}
              <span>{showMdSource ? "可视编辑" : "Markdown 源码"}</span>
            </span>
          </ToolbarButton>
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void insertImageFile(f);
            e.target.value = "";
          }}
        />
      </div>

      {/* 编辑主体：WYSIWYG 画布 或 Markdown 源码 */}
      {showMdSource ? (
        <textarea
          className="tiptap-md-source"
          value={value}
          onChange={(e) => {
            const next = e.target.value;
            lastEmittedMd.current = next;
            onChange(next);
          }}
          spellCheck={false}
          aria-label="Markdown 源码编辑"
        />
      ) : (
        <div className={`tiptap-editor-body ${disabled ? "is-disabled" : ""}`}>
          <EditorContent editor={editor} />
        </div>
      )}
    </div>
  );
}
