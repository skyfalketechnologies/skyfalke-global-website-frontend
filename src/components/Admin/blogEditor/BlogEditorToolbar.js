'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { BubbleMenu } from '@tiptap/react/menus';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaCode,
  FaLink,
  FaImage,
  FaTable,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaOutdent,
  FaIndent,
  FaMinus,
  FaEraser,
  FaTrash,
  FaColumns,
  FaGripLines,
} from 'react-icons/fa';

const ALIGN_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
  { value: 'full', label: 'Full width' },
];

function ToolbarButton({ onClick, active, disabled, title, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm transition-colors ${
        active
          ? 'bg-primary-600 text-white shadow-sm'
          : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
      } ${disabled ? 'cursor-not-allowed opacity-40' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

function ToolbarGroup({ label, children }) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-lg border border-gray-200/80 bg-gray-50/90 px-2 py-1.5 dark:border-gray-600 dark:bg-gray-800/80">
      {label && (
        <span className="mr-1 hidden text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:inline">{label}</span>
      )}
      {children}
    </div>
  );
}

export default function BlogEditorToolbar({
  editor,
  uploadingImage,
  onInsertImageFromFile,
}) {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [insertAlt, setInsertAlt] = useState('');
  const [insertCaption, setInsertCaption] = useState('');
  const [insertAlign, setInsertAlign] = useState('center');

  const [bubbleAlt, setBubbleAlt] = useState('');
  const [bubbleCaption, setBubbleCaption] = useState('');
  const [bubbleAlign, setBubbleAlign] = useState('center');

  const syncImageBubble = useCallback(() => {
    if (!editor || !editor.isActive('image')) return;
    const a = editor.getAttributes('image');
    setBubbleAlt(a.alt ?? '');
    setBubbleCaption(a.caption ?? '');
    setBubbleAlign(a.align || 'center');
  }, [editor]);

  useEffect(() => {
    if (!editor) return undefined;
    const handler = () => syncImageBubble();
    editor.on('selectionUpdate', handler);
    syncImageBubble();
    return () => {
      editor.off('selectionUpdate', handler);
    };
  }, [editor, syncImageBubble]);

  const updateImageAttrs = (attrs) => {
    if (!editor) return;
    editor.chain().focus().updateAttributes('image', attrs).run();
  };

  const closeModal = () => {
    setImageModalOpen(false);
    setFile(null);
    setInsertAlt('');
    setInsertCaption('');
    setInsertAlign('center');
  };

  const commitImageInsert = async () => {
    if (!onInsertImageFromFile) return;
    if (!file) {
      alert('Please choose an image file.');
      return;
    }
    if (!insertAlt.trim()) {
      alert('Alt text is required for accessibility and SEO.');
      return;
    }
    try {
      await onInsertImageFromFile({
        file,
        alt: insertAlt.trim(),
        caption: insertCaption.trim(),
        align: insertAlign,
      });
      closeModal();
    } catch {
      /* parent already alerted */
    }
  };

  if (!editor) return null;

  const inTable = editor.isActive('table');
  const listActive = editor.isActive('bulletList') || editor.isActive('orderedList');

  return (
    <>
      <BubbleMenu
        editor={editor}
        pluginKey="blogImageBubble"
        shouldShow={({ editor: ed }) => ed.isActive('image')}
        options={{
          placement: 'top',
          offset: 8,
        }}
        className="flex max-w-[min(100vw-2rem,28rem)] flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-600 dark:bg-gray-800"
      >
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Image</p>
        <label className="block text-xs text-gray-600 dark:text-gray-300">
          Alt text (SEO & accessibility)
          <input
            type="text"
            value={bubbleAlt}
            onChange={(e) => {
              const v = e.target.value;
              setBubbleAlt(v);
              updateImageAttrs({ alt: v });
            }}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Describe the image"
          />
        </label>
        <label className="block text-xs text-gray-600 dark:text-gray-300">
          Caption
          <input
            type="text"
            value={bubbleCaption}
            onChange={(e) => {
              const v = e.target.value;
              setBubbleCaption(v);
              updateImageAttrs({ caption: v });
            }}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Optional caption below the image"
          />
        </label>
        <div>
          <span className="text-xs text-gray-600 dark:text-gray-300">Position</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {ALIGN_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setBubbleAlign(opt.value);
                  updateImageAttrs({ align: opt.value });
                }}
                className={`rounded-md px-2 py-1 text-xs font-medium ${
                  bubbleAlign === opt.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteSelection().run()}
          className="flex items-center justify-center gap-2 rounded-md border border-red-200 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
        >
          <FaTrash className="h-3 w-3" />
          Remove image
        </button>
      </BubbleMenu>

      {imageModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Insert image</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Upload an image, add alt text for accessibility, and an optional caption.
            </p>
            <div className="mt-4 space-y-4" role="group" aria-label="Insert image fields">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Image file *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-primary-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Alt text *</label>
                <input
                  type="text"
                  value={insertAlt}
                  onChange={(e) => setInsertAlt(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Describe the image for screen readers"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Caption</label>
                <input
                  type="text"
                  value={insertCaption}
                  onChange={(e) => setInsertCaption(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Optional caption"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                <select
                  value={insertAlign}
                  onChange={(e) => setInsertAlign(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  {ALIGN_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={commitImageInsert}
                  disabled={uploadingImage || !file}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
                >
                  {uploadingImage ? 'Uploading…' : 'Insert'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white p-3 dark:border-gray-600 dark:from-gray-800 dark:to-gray-800/95">
        <div className="flex flex-wrap items-center gap-2">
          <ToolbarGroup label="Style">
            <select
              aria-label="Block type"
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'paragraph') editor.chain().focus().setParagraph().run();
                else editor.chain().focus().toggleHeading({ level: parseInt(value, 10) }).run();
              }}
              value={
                editor.isActive('heading', { level: 1 })
                  ? '1'
                  : editor.isActive('heading', { level: 2 })
                    ? '2'
                    : editor.isActive('heading', { level: 3 })
                      ? '3'
                      : editor.isActive('heading', { level: 4 })
                        ? '4'
                        : editor.isActive('heading', { level: 5 })
                          ? '5'
                          : editor.isActive('heading', { level: 6 })
                            ? '6'
                            : 'paragraph'
              }
              className="h-8 max-w-[8.5rem] rounded-md border border-gray-300 bg-white px-2 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="paragraph">Paragraph</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
              <option value="5">Heading 5</option>
              <option value="6">Heading 6</option>
            </select>
            <ToolbarButton
              title="Bold"
              active={editor.isActive('bold')}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <FaBold className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Italic"
              active={editor.isActive('italic')}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <FaItalic className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Underline"
              active={editor.isActive('underline')}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <FaUnderline className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Strikethrough"
              active={editor.isActive('strike')}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <FaStrikethrough className="h-3.5 w-3.5" />
            </ToolbarButton>
          </ToolbarGroup>

          <ToolbarGroup label="Lists">
            <ToolbarButton
              title="Bullet list"
              active={editor.isActive('bulletList')}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <FaListUl className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Numbered list"
              active={editor.isActive('orderedList')}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <FaListOl className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Decrease indent"
              disabled={!listActive}
              onClick={() => editor.chain().focus().liftListItem('listItem').run()}
            >
              <FaOutdent className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Increase indent"
              disabled={!listActive}
              onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
            >
              <FaIndent className="h-3.5 w-3.5" />
            </ToolbarButton>
          </ToolbarGroup>

          <ToolbarGroup label="Insert">
            <ToolbarButton
              title="Blockquote"
              active={editor.isActive('blockquote')}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <FaQuoteLeft className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Code block"
              active={editor.isActive('codeBlock')}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <FaCode className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Horizontal rule"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              <FaMinus className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Insert table"
              onClick={() =>
                editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
              }
            >
              <FaTable className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Insert image"
              disabled={uploadingImage}
              onClick={() => setImageModalOpen(true)}
            >
              <FaImage className="h-3.5 w-3.5" />
            </ToolbarButton>
          </ToolbarGroup>

          <ToolbarGroup label="Align">
            <ToolbarButton
              title="Align left"
              active={editor.isActive({ textAlign: 'left' })}
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
              <FaAlignLeft className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Align center"
              active={editor.isActive({ textAlign: 'center' })}
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
            >
              <FaAlignCenter className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Align right"
              active={editor.isActive({ textAlign: 'right' })}
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
            >
              <FaAlignRight className="h-3.5 w-3.5" />
            </ToolbarButton>
          </ToolbarGroup>

          <ToolbarGroup label="Link">
            <ToolbarButton
              title="Add link"
              active={editor.isActive('link')}
              onClick={() => {
                const prev = editor.getAttributes('link').href;
                const url = window.prompt('URL', prev || 'https://');
                if (url === null) return;
                if (url === '') {
                  editor.chain().focus().unsetLink().run();
                  return;
                }
                editor.chain().focus().setLink({ href: url }).run();
              }}
            >
              <FaLink className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Inline code"
              active={editor.isActive('code')}
              onClick={() => editor.chain().focus().toggleCode().run()}
            >
              <span className="font-mono text-xs">{'</>'}</span>
            </ToolbarButton>
            <ToolbarButton title="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
              <FaEraser className="h-3.5 w-3.5" />
            </ToolbarButton>
          </ToolbarGroup>
        </div>

        {inTable && (
          <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-2 dark:border-gray-600">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Table</span>
            <ToolbarGroup>
              <ToolbarButton title="Add row above" onClick={() => editor.chain().focus().addRowBefore().run()}>
                <FaGripLines className="h-3 w-3 rotate-180" />
              </ToolbarButton>
              <ToolbarButton title="Add row below" onClick={() => editor.chain().focus().addRowAfter().run()}>
                <FaGripLines className="h-3 w-3" />
              </ToolbarButton>
              <ToolbarButton title="Delete row" onClick={() => editor.chain().focus().deleteRow().run()}>
                <span className="text-xs font-bold">R−</span>
              </ToolbarButton>
              <ToolbarButton title="Add column before" onClick={() => editor.chain().focus().addColumnBefore().run()}>
                <FaColumns className="h-3 w-3" />
              </ToolbarButton>
              <ToolbarButton title="Add column after" onClick={() => editor.chain().focus().addColumnAfter().run()}>
                <FaColumns className="h-3 w-3 scale-x-[-1]" />
              </ToolbarButton>
              <ToolbarButton title="Delete column" onClick={() => editor.chain().focus().deleteColumn().run()}>
                <span className="text-xs font-bold">C−</span>
              </ToolbarButton>
              <ToolbarButton title="Toggle header row" onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
                <span className="text-[10px] font-semibold">H</span>
              </ToolbarButton>
              <ToolbarButton title="Merge cells" onClick={() => editor.chain().focus().mergeCells().run()}>
                <span className="text-[10px]">⊞</span>
              </ToolbarButton>
              <ToolbarButton title="Split cell" onClick={() => editor.chain().focus().splitCell().run()}>
                <span className="text-[10px]">⊟</span>
              </ToolbarButton>
              <ToolbarButton
                title="Delete table"
                onClick={() => editor.chain().focus().deleteTable().run()}
                className="!text-red-600 dark:!text-red-400"
              >
                <FaTrash className="h-3 w-3" />
              </ToolbarButton>
            </ToolbarGroup>
          </div>
        )}
      </div>
    </>
  );
}
