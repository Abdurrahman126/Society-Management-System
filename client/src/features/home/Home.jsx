import React from 'react'
import Footer from '../../components/Footer'
import News from './News'
import ScrollingAnnouncements from './ScrollingAnnouncements'



const Home = () => {
  return (
    <>
    <div className='min-h-screen w-full h-full lg:px-12 px-4'>
    <div className='h-dvh w-full flex flex-col justify-evenly items-center '>
      <p className='text-white font-extrabold lg:text-7xl text-4xl lg:leading-tight leading-snug lg:max-w-4xl tracking-widest text-center '>Dramatics <span className='lg:text-5xl text-3xl'>&</span><br></br> Extra-Curricular Society</p>
 

    </div>
    <div className="bottom-6 w-full flex justify-evenly items-center text-white font-extrabold lg:text-4xl text-xl leading-[4] relative px-7 self-end">
  <p className="absolute bottom-2 left-0 opacity-0 animate-create underline decoration-red-700">Create.</p>
  <p className="absolute bottom-2 opacity-0 animate-expand underline decoration-red-700">Expand.</p>
  <p className="absolute bottom-2 right-0 opacity-0 animate-explore underline decoration-red-700">Explore.</p>
</div>
    
    </div>
    <div className='w-full bg-transparent '>

<ScrollingAnnouncements/>


</div>

    <Footer/>
    </>
  )
}

export default Home