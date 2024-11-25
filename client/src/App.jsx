import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {RouterProvider,createBrowserRouter,createRoutesFromElements,Route,Link,Outlet} from "react-router-dom";
import Home from './features/home/Home'
import Login,{action as loginAction} from './features/login/Login'
import Navbar from './features/nav/Navbar';
import EventPage,{loader as eventLoader} from './features/event/EventPage';
import Booking,{loader as bookingLoader,action as bookingAction} from './features/event/Booking';
import Register,{action as registerAction} from './features/login/Register';
import MemberHome,{action as memberHomeAction} from './features/home/memberHome/MemberHome';
import AdminHome from './features/admin/AdminHome';
import EventsHandler,{action as eventHandlerAction} from './features/admin/event/EventsHandler';
import Nav from './features/admin/Nav';
import Announcement ,{action as announcementAction,loader as announcementLoader}from './features/admin/Announcement';
import Inductions,{loader as inductionsLoader,action as toggleAction} from './features/admin/inductions/Inductions';
import Team ,{action as teamAction} from './features/team/Team';
import Control,{loader as controlLoader,action as controlAction} from './features/admin/adminControl/Control';
import Meeting,{action as meetingAction,loader as meetingLoader} from './features/admin/meeting/Meeting';
import AdminLogin,{action as adminLoginAction} from './features/admin/AdminLogin';
import Attendance ,{loader as attendanceLoader} from './features/admin/attendance/Attendance';
import Forum,{loader as forumLoader}  from './features/forum/Forum';
import ForumControl ,{loader as forumControlLoader}from './features/admin/forumControl/ForumControl';
import MemberNav from './features/home/memberHome/MemberNav';
import MemberAttendance from './features/home/memberHome/MemberAttendance';
import MemberMeetings from './features/home/memberHome/MemberMeetings';
import Queries from './features/home/memberHome/Queries';

const router=createBrowserRouter(createRoutesFromElements(
  <>
  <Route path="/" element={<Navbar/>}>
    <Route index element={<Home/>} />
    <Route path="login" element={<Login/>} action={loginAction}/>
    <Route path="events" element={<EventPage/>} loader={eventLoader}/>
    
    <Route path="register" element={<Register/>} action={registerAction}/>
  </Route>
  <Route path="/events/:id" element={<Booking/>} loader={bookingLoader} action={bookingAction}/>
  <Route path="/members" element={<MemberNav/>} >
   <Route index element={<MemberHome/>}  />
   <Route path="attendance" element={<MemberAttendance/>}  />
   <Route path="meetings" element={<MemberMeetings/>}  />
   <Route path="queries" element={<Queries/>}  />
   

   
  </Route>
  <Route path="/inductions" element={<Team/>} action={teamAction} />
  <Route path="/forum" element={<Forum/>} loader={forumLoader}/>
 
  <Route path="/admin" element={<Nav/>} >
  
  <Route index element={<AdminHome/>}/>
  <Route path="control" element={<Control/>} loader={controlLoader} action={controlAction}/>

  <Route path="manageEvents" element={<EventsHandler/>} loader={eventLoader} action={eventHandlerAction}/>
  <Route path="announce" element={<Announcement/>} action={announcementAction} loader={announcementLoader}/>
  <Route path="inductions" element={<Inductions/>} loader={inductionsLoader} action={toggleAction}/>
  <Route path="meeting" element={<Meeting/>} action={meetingAction} loader={meetingLoader}/>
  <Route path="attendance" element={<Attendance/>} loader={attendanceLoader}/>
  <Route path="manageForum" element={<ForumControl/>} loader={forumControlLoader}/>

  </Route>


  <Route path="admin/login" element={<AdminLogin/>} action={adminLoginAction}/>
 
  </>)
)

export default function App()
{
  return <RouterProvider router={router}/>
}
