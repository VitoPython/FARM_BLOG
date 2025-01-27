import React from 'react'

export default function Modal({onClickNo, onClickYes}) {
  return (
    <div className='flex items-center justify-center fixed left-0 bottom-0 w-full h-full'
        style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
    >
        <div className='bg-white p-12 rounded-md'> 
            <h1 className='text-[16px] font-semibold'>Are you sure want to delete this blog ?</h1>    
            <div className='flex flex-row items-center my-4 justify-center gap-x-3'>
                <button 
                onClick={onClickNo}
                className='px-5 py-2.5 border-none bg-gray-300 hover:bg-gray-400 text-black cursor-pointer rounded-full' >
                    No
                </button>
                <button 
                onClick={onClickYes}
                className='px-5 py-2.5 border-none bg-blue-300 hover:bg-blue-400 text-black cursor-pointer rounded-full'>
                    Yes
                </button>
            </div>
         </div>
    </div>
  )
}
