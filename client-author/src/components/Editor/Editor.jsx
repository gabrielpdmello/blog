import styles from "./Editor.module.css";
import {
  MDXEditor,
  headingsPlugin,
  quotePlugin,
  listsPlugin,
  thematicBreakPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  linkPlugin,
  linkDialogPlugin,
  diffSourcePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  InsertCodeBlock,
  BlockTypeSelect,
  CodeToggle,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

function Editor({ ref, markdown = "" }) {
  return (
    <MDXEditor
      ref={ref}
      markdown={markdown}
      contentEditableClassName={styles.editor}
      plugins={[
        headingsPlugin(),
        quotePlugin(),
        listsPlugin(),
        thematicBreakPlugin(),
        linkDialogPlugin(),
        diffSourcePlugin({ diffMarkdown: markdown, viewMode: "rich-text" }),
        tablePlugin(),
        linkPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            txt: "Plain Text",
          },
          autoLoadLanguageSupport: true,
        }),

        toolbarPlugin({
          toolbarClassName: "toolbar",
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <BlockTypeSelect />
              <CodeToggle />
              <CreateLink />
              <DiffSourceToggleWrapper />
              <InsertTable />
              <InsertThematicBreak />
              <ListsToggle />
              <InsertCodeBlock />
            </>
          ),
        }),
      ]}
    />
  );
}

export default Editor;
