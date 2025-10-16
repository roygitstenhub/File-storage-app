import React, { useEffect } from 'react'
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import DirectoryView from './DirectoryView'
import Register from './Pages/Register'
import Login from './Pages/Login'
import UsersPage from './Pages/UserPage'
import Error from './components/Error'
import Plans from './Pages/Plans'

const router = createBrowserRouter([
  {
    path: "/",
    element: <DirectoryView />
  },
  {
    path: "*",
    element: <Error />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/directory/:dirId",
    element: <DirectoryView />
  },
  {
    path: "/users",
    element: <UsersPage />,
  },
  {
    path: "/plans",
    element: <Plans />,
  },

])

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
