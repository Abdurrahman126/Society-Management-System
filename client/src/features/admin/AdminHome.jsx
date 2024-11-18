import React from 'react'

const AdminHome = () => {
    ///this page woudl contain all the functions the admin can perform 
   function addEvent()
   {
    
   }

  return (
    <div>
        <h1>I am admin</h1>
        <button onClick={addEvent}>Add event</button>
    </div>
  )
}

export default AdminHome