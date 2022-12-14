import { convertFromRaw, EditorState } from "draft-js";
import dynamic from "next/dynamic";
import { useCallback } from "react";
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then(mod => mod.Editor),
  { ssr: false }
)

const SidebarShowEditor = ({posts}) => {
  const sidebar = posts.sidebars
  const showState = useCallback((cont) => {
    return EditorState.createWithContent(convertFromRaw(JSON.parse(cont)))
  }, [])

  return (
    sidebar.map((item, index) => (
      <article key={index}>
        <Editor
          editorState={showState(item.content)}
          toolbarHidden
          readOnly
          localization={{ locale: "ja" }}
        />
      </article>
    ))
  )
}

export default SidebarShowEditor;