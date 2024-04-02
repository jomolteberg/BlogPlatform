import { FC } from "react";
import ReactQuill from "react-quill"; // Ensure correct import
import "react-quill/dist/quill.snow.css"; // include styles

type ArticleEditorProps = {
  content: string;
  onContentChange: (content: string) => void;
};


const ArticleEditor: FC<ArticleEditorProps> = ({content, onContentChange}) => {

  return (
  

    <ReactQuill
      value={content}
      onChange={onContentChange}
      style={{height: '300px'}}
     
      />
      
  );
};

export default ArticleEditor;
