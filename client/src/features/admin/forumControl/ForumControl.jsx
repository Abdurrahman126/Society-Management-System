import React,{useState} from 'react'
import { useLoaderData } from 'react-router-dom';
import PostCard from '@/features/forum/PostCard';
export async function loader()
{

    try {
        const response = await fetch('http://127.0.0.1:5001/api/get_posts'); 
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
    const mappedPosts=posts.map((item) => (
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
    ))
    async function handleDelete(id) {
      try {
        const response = await fetch(`http://127.0.0.1:5001/api/delete_post/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
    
        if (response.ok) {
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post.feedback_id !== parseInt(id))
          );
          console.log(data.message);
        } else {
          console.log(data.error);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
    
  return (
    <div className='flex flex-col justify-evenly gap-y-2'>
      
        {posts.length===0 && <h1 className='text-white font-4xl'>No Posts On forum Currently</h1>}
       {posts.length>0 && mappedPosts}</div>
  )
}

export default ForumControl