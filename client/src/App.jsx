import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {RouterProvider,createBrowserRouter,createRoutesFromElements,Route,Link,Outlet} from "react-router-dom";
import Home from './features/home/Home'
import Login,{action as loginAction} from './features/login/Login'
import Navbar from './features/nav/Navbar';
import EventPage,{loader as eventLoader} from './features/event/EventPage';
import Booking,{loader as bookingLoader,action as bookingAction} from './features/event/Booking';
import Register,{action as registerAction} from './features/login/Register';
import MemberHome from './features/home/MemberHome';
import AdminHome from './features/admin/AdminHome';
import EventsHandler,{action as eventHandlerAction} from './features/admin/EventsHandler';
import Nav from './features/admin/Nav';
import Announcement ,{action as announcementAction}from './features/admin/Announcement';
import Inductions from './features/admin/Inductions';
import Team from './features/team/Team';
const router=createBrowserRouter(createRoutesFromElements(
  <>
  <Route path="/" element={<Navbar/>}>
    <Route index element={<Home/>} />
    <Route path="login" element={<Login/>} action={loginAction}/>
    <Route path="events" element={<EventPage/>} loader={eventLoader}/>
    <Route path="register" element={<Register/>} action={registerAction}/>
  </Route>
  <Route path="/events/:id" element={<Booking/>} loader={bookingLoader} action={bookingAction}/>
  <Route path="/members" element={<MemberHome/>} />
  <Route path="/inductions" element={<Team/>} />
 
  <Route path="/admin" element={<Nav/>} >
  
  <Route index element={<AdminHome/>}/>
 
  <Route path="manageEvents" element={<EventsHandler/>} loader={eventLoader} action={eventHandlerAction}/>
  <Route path="announce" element={<Announcement/>} action={announcementAction}/>
 
  </Route>
  </>)
)

export default function App()
{
  return <RouterProvider router={router}/>
}
