import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebaseConfig";
import PostCard from "./PostCard";
import { useDispatch, useSelector } from "react-redux";
import { selectEmail, loggedIn } from "./forumSlice";

const formSchema = z.object({
  content: z.string().min(1, { message: "Body cannot be empty." }),
});

export async function loader() {
  try {
    const response = await fetch('http://alimurtazaathar.pythonanywhere.com/api/get_posts');
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export function Forum() {
  const postData = useLoaderData();
  // console.log(postData)
  const dispatch = useDispatch();
  const loggedMail = useSelector(selectEmail); 
  const [userEmail, setUserEmail] = useState(loggedMail || "");
  const [error, setError] = useState("");
  const [posts, setPosts] = useState(postData);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (values) => {
    let email = userEmail;

    if (!email) {
      email = await handleLogin();
    }

    if (!email || !email.endsWith('@nu.edu.pk')) {
      setError('You must log in with a @nu.edu.pk email address.');
      return;
    }
    
    const payload = { email, content: values.content };

    try {
      const response = await fetch('http://alimurtazaathar.pythonanywhere.com/api/add_post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data.feedback_id)
      if (response.ok) {
        console.log('Post submitted:', data.message);
        setError('');

        // Update the posts state without reloading
        setPosts((prevPosts) => [
          { 
            feedback_id: data.feedback_id, // Assuming the server responds with the new post ID
            content: values.content,
            email,
            likes: 0,
            timestamp: new Date().toISOString(), 
          },
          ...prevPosts,
          
        ]);

        // Reset form values
        form.reset();
      } else {
        console.log('Error:', data.error);
        setError(data.error || 'Failed to submit post');
      }
    } catch (err) {
      setError('Failed to submit post. Please try again.');
    }
  };

  const handleLogin = async () => {

    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      if (email.endsWith('@nu.edu.pk')) {
        setError(''); 
        setUserEmail(email);
        dispatch(loggedIn(email)); 
        return email;
      } else {
        setError('You must log in with a @nu.edu.pk email address.');
        return null;
      }
    } catch (error) {
      setError('Login error: ' + error.message);
      return null;
    }
  };

  async function handleLikes(event) {
    event.preventDefault();
    let email = userEmail;

    if (!email) {
      email = await handleLogin();
    }

    if (!email || !email.endsWith('@nu.edu.pk')) {
      setError('You must log in with a @nu.edu.pk email address.');
      return;
    }
   
    console.log("atleast we're here")
    const form = new FormData(event.target);
    const id = form.get('id'); 
    const response = await fetch(`http://alimurtazaathar.pythonanywhere.com/api/like_post/${id}`, {
      method: 'POST',
    });
    const data = await response.json();
    console.log(data.likes.likes)

    if (response.ok) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.feedback_id === parseInt(id)
            ? { ...post, likes: data.likes.likes } 
            : post 
        )
      );
    } else {
      console.log(data.message);
    }
  }
  
  
  return (
    <div classname="absolute">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {error && <div className="text-red-500">{error}</div>}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your post" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" name="intent" value="post">Post</Button>
        </form>
      </Form>
      {posts.map((item) => (
        <PostCard
          key={item.feedback_id}
          id={item.feedback_id}
          email={item.email}
          content={item.content}
          time={item.timestamp}
          likes={item.likes}
          handler={handleLikes}
        />
      ))}
    </div>
  );
}

export default Forum;
