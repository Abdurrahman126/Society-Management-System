import React,{useState} from 'react'
import { useLoaderData } from 'react-router-dom';
import PostCard from '@/features/forum/PostCard';
export async function loader()
{

    try {
        const response = await fetch('https://alimurtazaathar.pythonanywhere.com/api/get_posts'); 
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        return data;
      }
      catch(error){
        console.log(error.message);
        return null;
      }
}



const ForumControl = () => {
    const postData=useLoaderData();
    const [posts, setPosts] = useState(postData);

    async function handleDelete(id){
        const response = await fetch(`https://alimurtazaathar.pythonanywhere.com/api/delete_post/${id}`, {
          method: 'delete',
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post.feedback_id !== parseInt(id))
          );
          
          return  {message:data.message}
      
    
         } else {
          console.log(data.message)
          return { error: data.error }
        }
        
      }
     
  return (
    <div>   {posts.map((item) => (
        <PostCard
          key={item.feedback_id}
          id={item.feedback_id}
          email={item.email}
          content={item.content}
          time={item.timestamp}
          likes={item.likes}
          handler={handleDelete}
          btn="true"
        
        />
      ))}</div>
  )
}

export default ForumControl