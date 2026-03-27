import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-slate-800 text-white' >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 py-3 gap-3">
      <div className='logo font-bold text-white text-2xl '>
       
        <span className='text-green-700'> &lt;</span>
         Pass
         <span className='text-green-700'>OP/&gt;</span>
        </div>
      <ul>
        <li className='flex gap-4 text-sm md:text-base'>
          <a className='hover:font-bold' href="/">Home</a>
          <a className='hover:font-bold' href="#">About</a>
          <a className='hover:font-bold' href="#">Contact</a>
        </li>
      </ul>
      </div>
    </nav>
  )
}

export default Navbar
