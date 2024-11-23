import React from 'react'
import { Form, useLoaderData } from 'react-router-dom'
import AnnouncementCard from '@/components/AnnouncementCard';
export  async function loader(){

  try {
      const response = await fetch(`http://127.0.0.1:5001/api/announcements`);
      if (!response.ok) {
          throw new Error('Failed to fetch event data');
      }
      const data = await response.json();
      return data; 
  } catch (error) {
      console.log(error.message);
      return { error: 'Failed to load event data' }; // Return an error object
  }

}


export const action = async ({ request }) => {
  const formData = new URLSearchParams(await request.formData());
  const intent=formData.get("intent")
 
  if(intent==="post"){
    const response = await fetch('http://127.0.0.1:5001/api/add_announcements', {
      method: 'POST',
      body: formData,
    });
    const postdata = await response.json();
  
    if (response.ok) {
      return  {message:postdata.message}
    } else {
      console.log(postdata.message)
      return { error: postdata.error }
    }
  }
  else if(intent==="delete"){
    const id=formData.get('id');
    const response = await fetch(`http://127.0.0.1:5001/api/delete_announcement/${id}`, {
      method: 'delete',
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return  {message:data.message}
  

     } else {
      console.log(data.message)
      return { error: data.error }
    }
    
  }
  
  };
  

const Announcement = () => {

  const array=useLoaderData();
  const announcement=array.map((item)=>{
    return(
  
    <AnnouncementCard key={item.announcement_id} id={item.announcement_id} title={item.announcement_title}
    content={item.content} link={item.link}  tag="Delete Announcement"/>
    )
})
  return (
    <div>
     


        <h1 className='text-white'>Announcemnt List:</h1>
        {announcement}
       
        <Form method='post' className="w-[90%] flex flex-col justify-evenly  gap-4">
          <input name="title" placeholder='Heading' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
          <input name="content" type="text" placeholder='Description'  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8 '/>
          <label htmlFor='link' className='text-white'>Link</label>
          <input name="link" type="text" placeholder='Description'  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8 '/>
          
          <button className='bg-red-600 text-white lg:p-4 p-3 rounded-lg lg:w-[70%] w-[90%]'>Post Announcmenet</button>
          </Form>
          
    </div>
  )
}

export default Announcement