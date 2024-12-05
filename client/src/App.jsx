import { useState } from 'react'
import { Toaster } from '@/components/ui/toaster';  // Import the Toaster component
import { Button } from "@/components/ui/button"
import {RouterProvider,createBrowserRouter,createRoutesFromElements,Route,Link,Outlet} from "react-router-dom";
import Home from './features/home/Home'
import Login,{action as loginAction} from './features/login/Login'
import Navbar from './features/nav/Navbar';
import EventPage,{loader as eventLoader} from './features/event/EventPage';
import Booking,{loader as bookingLoader,} from './features/event/Booking';
import Register,{action as registerAction} from './features/login/Register';
import MemberHome,{action as memberHomeAction} from './features/home/memberHome/MemberHome';
import AdminHome,{loader as adminHomeLoader} from './features/admin/AdminHome';
import EventsHandler,{action as eventHandlerAction} from './features/admin/event/EventsHandler';
import Nav from './features/admin/Nav';
import Announcement ,{action as announcementAction,loader as announcementLoader}from './features/admin/Announcement';
import Inductions,{loader as inductionsLoader,action as toggleAction} from './features/admin/inductions/Inductions';
import Team ,{action as teamAction,loader as teamLoader} from './features/team/Team';
import Control,{loader as controlLoader,action as controlAction} from './features/admin/adminControl/Control';
import Meeting,{action as meetingAction,loader as meetingLoader} from './features/admin/meeting/Meeting';
import AdminLogin from './features/admin/AdminLogin';
import Attendance ,{loader as attendanceLoader} from './features/admin/attendance/Attendance';
import Forum,{loader as forumLoader}  from './features/forum/Forum';
import ForumControl ,{loader as forumControlLoader}from './features/admin/forumControl/ForumControl';
import MemberNav,{loader as memberNavLoader} from './features/home/memberHome/MemberNav';
import MemberAttendance,{loader as memberAttendanceLoader} from './features/home/memberHome/MemberAttendance';
import MemberMeetings,{loader as memberMeetingLoader} from './features/home/memberHome/MemberMeetings';
import Queries from './features/home/memberHome/Queries';

const router=createBrowserRouter(createRoutesFromElements(
  <>
  <Route path="/" element={<Navbar/>}>
    <Route index element={<Home/>} />
    <Route path="login" element={<Login/>} action={loginAction}/>
    <Route path="events" element={<EventPage/>} loader={eventLoader}/>
    
  <Route path="inductions" element={<Team/>} action={teamAction} loader={teamLoader}/>
  <Route path="forum" element={<Forum/>} loader={forumLoader}/>
    <Route path="register" element={<Register/>} action={registerAction}/>
   
  </Route>
  <Route path="/events/:id" element={<Booking/>} loader={bookingLoader} />
  <Route path="/members" element={<MemberNav/>} loader={memberNavLoader}>
   <Route index element={<MemberHome/>}  />
   <Route path="attendance/:roll_number" element={<MemberAttendance/>} loader={memberAttendanceLoader} />
   <Route path="meetings" element={<MemberMeetings/>}  loader={memberMeetingLoader}/>
   <Route path="queries" element={<Queries/>}  />
   

   
  </Route>
 
  <Route path="/admin" element={<Nav/>} >
  
  <Route index element={<AdminHome/>} loader={adminHomeLoader}/>
  <Route path="control" element={<Control/>} loader={controlLoader} action={controlAction}/>

  <Route path="manageEvents" element={<EventsHandler/>} loader={eventLoader} action={eventHandlerAction}/>
  <Route path="announce" element={<Announcement/>} action={announcementAction} loader={announcementLoader}/>
  <Route path="inductions" element={<Inductions/>} loader={inductionsLoader} action={toggleAction}/>
  <Route path="meeting" element={<Meeting/>} action={meetingAction} loader={meetingLoader}/>
  <Route path="attendance" element={<Attendance/>} loader={attendanceLoader}/>
  <Route path="manageForum" element={<ForumControl/>} loader={forumControlLoader}/>
  <Route path="login" element={<AdminLogin/>} />

  </Route>


 
  </>)
)

export default function App()
{
  return( <><RouterProvider router={router}/>
    <Toaster />  </>
  )
  }
