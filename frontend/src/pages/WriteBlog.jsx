import React, { useState, useEffect, useRef, useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import CodeBlock from "@tiptap/extension-code-block";
import firebase from "../utils/firebase";
import "./WriteBlog.css";
import { useNavigate } from "react-router-dom";
import Loading from "./../components/Loading";
import { IoIosCloseCircleOutline } from "react-icons/io";
export default function WriteBlog({
  isEdit = true,
  idData,
  titleData,
  descData,
  slugData,
  imgData,
  contentData,
  onClickEdit,
}) {
  const [editorContent, setEditorContent] = useState(
    isEdit ? contentData : "<p>Type Here...</p>"
  );
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState(isEdit ? titleData : "");
  const [desc, setDesc] = useState(isEdit ? descData : "");
  const [slug, setSlug] = useState(isEdit ? slugData : "");
  const [media, setMedia] = useState(isEdit ? imgData : "");

  const Navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        autolink: true,
        openOnClick: true,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Bold,
      Italic,
      Underline,
      CodeBlock,
    ],
    content: isEdit ? contentData : "<p>Type Here...</p>",
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      editor.on("update", handleChange);
    }
  }, [editor]);

  const handleChange = () => {
    if (editor) {
      setEditorContent(editor.getHTML());
    }
  };

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-] + /g, "")
      .replace(/^-+|-+$/g, "");

  const addImage = useCallback(
    async (e) => {
      setIsLoading(true);
      const selectedFile = e.target.files[0];
      const fileFormat = new Date().getTime() + selectedFile.name + "_";
      const folderName = "write_blog/";
      const fileUrl = await firebase.uploadFileAsync(
        folderName,
        selectedFile,
        fileFormat,
        2
      );
      if (fileUrl) {
        if (editor) {
          editor.chain().focus().setImage({ src: fileUrl }).run();
          setMedia(fileUrl);
          setIsLoading(false);
        }
      }
    },
    [editor]
  );
  if (!editor) {
    return null;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (isEdit) {
      console.log('edit');
      const response = await fetch(`http://localhost:8000/api/v1/post/${idData}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          desc,
          content: editorContent,
          img: media,
          slug: slug,
          updated_at: new Date(),
        }),
      });
  
      if (response.status === 200) {
        setTimeout(() => {
          Navigate(0);
        }, 1000);
      }
    
    } else {
    console.log(editorContent);
    const response = await fetch("http://localhost:8000/api/v1/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        desc,
        content: editorContent,
        img: media,
        slug: slug,
        created_at: new Date(),
      }),
    });

    if (response.status === 200) {
      setTimeout(() => {
        Navigate("/");
      }, 1000);
    }
  };
}

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      {isLoading ? <Loading /> : null}
      <div className="flex flex-col w-[740px] md:w-[560px]">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold mb-4">
            {isEdit ? "Update" : "Write"} Blog
          </h1>
          {isEdit ? <div className='flex flex-row gap-x-3'>
          <button
          className="border rounded-md p-3 shadow-sm hover:shadow-lg hover:bg-gray-100 transition"
          onClick={onClickEdit}
        >
          <IoIosCloseCircleOutline className="h-4 w-4 hover:text-blue-900" />
        </button>
        </div>  : null}
        </div>

       

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            className="py-[25px] h-[100px] text-4xl border-none outline-none bg-transparent placeholder:text-[#b3b3b1]"
            type="text"
            placeholder="Title"
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(slugify(e.target.value));
            }}
            value={title}
          />
          <input
            className="py-[25px] h-[100px] text-2xl border-none outline-none bg-transparent placeholder:text-[#b3b3b1]"
            type="text"
            placeholder="Description"
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
          />

          <div className="flex flex-row gap-x-3">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={
                editor.isActive("bold")
                  ? "px-3 bg-black text-white"
                  : "px-3 bg-[#b3b3b1] text-white"
              }
            >
              Bold
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={
                editor.isActive("italic")
                  ? "px-3 bg-black text-white"
                  : "px-3 bg-[#b3b3b1] text-white"
              }
            >
              Italic
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              className={
                editor.isActive("strike")
                  ? "px-3 bg-black text-white"
                  : "px-3 bg-[#b3b3b1] text-white"
              }
            >
              Strike
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={
                editor.isActive("strike")
                  ? "px-3 bg-black text-white"
                  : "px-3 bg-[#b3b3b1] text-white"
              }
            >
              Code block
            </button>
            <div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  fileInputRef.current.click();
                }}
                className="px-3 text-white bg-[#b3b3b1]"
              >
                Image
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={addImage}
                accept="image/*" // accept only images
              />
            </div>
          </div>
          <EditorContent editor={editor} />

          <div className="text-left">
            <button
              className="px-5 py-2.5 bg-[#1a8917] text-white rounded-md shadow-sm hover:shadow-lg transition hover:scale-105"
              type="submit"
            >
              {isEdit ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
