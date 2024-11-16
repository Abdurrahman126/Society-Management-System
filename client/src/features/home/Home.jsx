import React from 'react'
import Footer from '../../components/Footer'
const Home = () => {
  return (
    <>
    <div className='min-h-screen w-full h-full px-12'>
    <div className='h-dvh w-full flex flex-col justify-evenly items-center '>
      <p className='text-white font-extrabold text-7xl leading-tight max-w-4xl tracking-widest text-center '>Drama <span className='text-6xl'>&</span> Extra Curriculars Society</p>
 

    </div>
    <div className="bottom-6 w-full flex justify-evenly items-center text-white font-extrabold text-4xl leading-[4] relative px-7 self-end">
  <p className="absolute bottom-0 left-0 opacity-0 animate-create underline decoration-red-700">Create.</p>
  <p className="absolute bottom-0 opacity-0 animate-expand underline decoration-red-700">Expand.</p>
  <p className="absolute bottom-0 right-0 opacity-0 animate-explore underline decoration-red-700">Explore.</p>
</div>

    <h1 className='text-white font-extrabold text-2xl align-middle'>Announcements</h1>
  <p className='text-white'>To be made!</p>
    </div>
    <Footer/>
    </>
  )
}

export default Home