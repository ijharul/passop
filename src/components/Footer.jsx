import React from 'react'

const Footer = () => {
  return (
    <footer className=' bg-slate-800 text-white'>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 px-4 py-4">
       <div className='logo font-bold text-white text-2xl '>
       
        <span className='text-green-700'> &lt;</span>
         Pass
         <span className='text-green-700'>OP/&gt;</span>
        </div>
       <div className="copyright text-white w-50%
        flex justify-center items-center gap-1 whitespace-nowrap">
    © {new Date().getFullYear()} Created with ❤️ by 
      <span className="font-semibold">Ijharul Haque</span>
         
       </div>
      </div>
    </footer>
  )
}

export default Footer