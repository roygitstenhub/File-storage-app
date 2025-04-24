import React from 'react'
import { RouterProvider , createBrowserRouter } from "react-router-dom"
import DirectoryView from './DirectoryView'
import Register from './Pages/Register'
import Login from './Pages/Login'

const router = createBrowserRouter([
  {
    path:"/",
    element:<DirectoryView/>
  },
  {
    path:"/register",
    element:<Register/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/directory/:dirId",
    element:<DirectoryView/>
  },
])

const App = () => {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
