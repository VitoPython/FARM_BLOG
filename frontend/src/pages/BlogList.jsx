import React, { useState, useEffect } from 'react'
import { HiOutlinePencilAlt } from 'react-icons/hi';
import BlogCard from '../components/BlogCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
export default function BlogList() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: 'Electinics is a part of our life',
      desc: 'Electronics is the discipline dealing with the development and application of devices and systems involving the flow of electrons in a vacuum, in gaseous media, and in semiconductors.',
      img: 'https://random.imagecdn.app/500/150',
      slug: "Hello slug",
    },
  ]);


  const fetchBlogs = async () => {
    try {
      setIsLoading(true);

      const response = await  axios.get('http://localhost:8000/api/v1/post/');
      console.log(response);
      setBlogs(response.data.result);
    } catch(error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000)
      console.log('done');
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, [])
  
  return (

    <div className='flex flex-col items-center justify-center  min-h-screen p-4'>
        {isLoading ? <Loading /> : null}
        <div className="flex flex-col w-[740px] md:w-[560px]">
            <div className='flex flex-row justify-between'>
                <h1 className='text-2xl font-bold mb-4'>BlogList</h1>
                <button className='border rounded-md p-3 shadow-sm hover:shadow-lg hover:bg-gray-100 transition'
                  onClick={() => {
                    navigate('/write')
                  }}
                >
                    
                    <HiOutlinePencilAlt className='h-4 w-4 hover:text-white'/>
                </button>
            </div>
    
            <div className='grid gap-4 mt-3'>
             
            {
                blogs.map((card, index) => (
                    <BlogCard 
                    key={card.id} 
                    title={card.title} 
                    description={card.desc} 
                    image={card.img} 
                    onClick={() => {
                      navigate('/blog/' + card.id)
                    }} />
                ))
            }
             
            </div>

        </div>
        
    </div>
  )
}
