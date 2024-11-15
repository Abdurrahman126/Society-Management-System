import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {RouterProvider,createBrowserRouter,createRoutesFromElements,Route,Link,Outlet} from "react-router-dom";
import Home from './features/home/Home'
import Login from './features/login/Login'
import Navbar from './components/Navbar';
import EventPage,{loader as eventLoader} from './features/event/EventPage';
import Booking,{loader as bookingLoader,action as bookingAction} from './features/event/Booking';
const router=createBrowserRouter(createRoutesFromElements(
  <>
  <Route path="/" element={<Navbar/>}>
    <Route index element={<Home/>} />
    <Route path="login" element={<Login/>}/>
    <Route path="events" element={<EventPage/>} loader={eventLoader}/>
  </Route>
  <Route path="/events/:id" element={<Booking/>} loader={bookingLoader} action={bookingAction}/>
  
  </>)
)

export default function App()
{
  return <RouterProvider router={router}/>
}
