import React, {useState, useEffect} from "react";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LiaArrowLeftSolid } from "react-icons/lia";
import WriteBlog from "./WriteBlog";
import Modal from "../components/Modal";
import Loading from "./../components/Loading";
export default function BlogDetail({ id }) {
  const currentUrl = window.location.href;
  const urlParts = currentUrl.split("/blog/");
  const idUrl = urlParts.pop();

  const [isEdit, setIsEdit] =useState(false)
  const [isDelete, setIsDelete]= useState(false)
    const [isLoading, setIsLoading] = useState(false);
  
  const [blog, setBlog] = useState({
    id: '1',
    title: 'Electinics is a part of our life',
    desc: 'Electronics is the discipline dealing with the development and application of devices and systems involving the flow of electrons in a vacuum, in gaseous media, and in semiconductors.',
    img: 'https://random.imagecdn.app/500/150',
    slug: "Hello slug",
  })

  const fetchData = async() => {
    try {
          const response = await fetch(`http://localhost:8000/api/v1/post/${idUrl}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.error("Failed to fetch data from server");
          return;
        }

        const {result} = await response.json();
        const [data] = result;

        setBlog({
          id:data.id,
          title:data.title,
          desc:data.desc,
          content: data.content,
          img: data.img,
          slug: data.slug,
        })

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    useEffect(() => {
      fetchData();
    }, [])

    const handleClickDelete = async() => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/post/${idUrl}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.error("Failed to fetch data from server");
          return;
        }
        window.location.replace('/')
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

  return (
    <div className="flex flex-col items-center justify-center  min-h-screen p-4">
      {isDelete ? <Modal 
      onClickNo={() => {
        setIsDelete(false)
      }}
      onClickYes={handleClickDelete}
      /> : null}
      {isLoading ? <Loading /> : null}
      <div className="flex flex-col w-[740px] md:w-[560px]">
        {isEdit ? (
          <WriteBlog 
          blog={blog.title} 
          idData={idUrl}
          titleData={blog.title}
          descData={blog.desc}
          slugData={blog.slug}
          contentData={blog.content}
          imgData={blog.img}
          onClickEdit={() => {
            setIsEdit(!isEdit)
          }}
         />) :        <div id="content">
          <button className='border rounded-md p-3 shadow-sm bg-slate-100 hover:shadow-lg hover:bg-gray-100 transition'
                  onClick={() => {
                    window.history.back();
                  }}
                > 
                  <LiaArrowLeftSolid />
                </button>
          <div className="flex flex-row justify-between">
              <h1 className='text-2xl font-bold mb-4'>{blog.title}</h1>
              <div className='flex flex-row gap-x-3'>
                {isEdit ? 
                <button className='border rounded-md p-3 shadow-sm hover:shadow-lg hover:bg-gray-100 transition'
                  onClick={() => {
                    setIsEdit(true)
                  }}
                >
                  <IoIosCloseCircleOutline className='h-4 w-4 hover:text-blue-900'/>
                </button>
                : <>
                <button className='border rounded-md p-3 shadow-sm hover:shadow-lg hover:bg-gray-100 transition'
                  onClick={() => {
                    setIsEdit(true)
                  }}
                >
                  <HiOutlinePencilAlt className='h-4 w-4 hover:text-blue-900'/>
                </button>
                <button className='border rounded-md p-3 shadow-sm hover:shadow-lg hover:bg-gray-100 transition'
                  onClick={() => {
                    setIsDelete(true)
                  }}
                >
                  <HiOutlineTrash className='h-4 w-4 hover:text-red-700'/>
                </button>
                </>
                }
                
              </div>
          </div>
          <h2 className='py-[25px] h-[100px] text-xl border-none outline-none bg-transparent placeholder:text-[#b3b3b1]'>{blog.desc}</h2>
          <div className="flex gap-[50px]">
            <div className='flex-[5] mt-[60px]'>
              <div className='text-xl font-light mb-5'
              dangerouslySetInnerHTML={{ __html: blog?.content }}>

              </div>
            </div>
          </div>
        </div> }

      </div>
    </div>
  );
}
