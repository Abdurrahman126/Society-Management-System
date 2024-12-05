import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoaderData } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { selectEmail, loggedIn } from "./forumSlice";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from 'lucide-react';
import PostCard from "./PostCard";

const formSchema = z.object({
  content: z.string().min(1, { message: "Body cannot be empty." }),
});

export async function loader() {
  try {
    const response = await fetch('http://127.0.0.1:5001/api/get_posts');
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
  console.log(postData)
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
      const response = await fetch('http://127.0.0.1:5001/api/add_post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setError('');
        setPosts((prevPosts) => [
          { 
            feedback_id: data.feedback_id,
            content: values.content,
            email,
            likes: 0,
            timestamp: new Date().toISOString(), 
          },
          ...prevPosts,
        ]);
        form.reset();
      } else {
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
   
    const form = new FormData(event.target);
    const id = form.get('id'); 
    const response = await fetch(`http://127.0.0.1:5001/api/like_post/${id}`, {
      method: 'POST',
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.feedback_id === parseInt(id)
            ? { ...post, likes: data.likes} 
            : post 
        )
      );
    } else {
      console.log(data.message);
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <MessageCircle className="mr-2 " />
            Forum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Post</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What's on your mind?" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full py-4 bg-red-600 hover:bg-white hover:text-black hover:border-2 hover:border-black">Post</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="space-y-4">
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
    </div>
  );
}

export default Forum;

