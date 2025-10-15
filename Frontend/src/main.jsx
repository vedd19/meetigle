import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Room from './components/Room/Room.jsx';
import Landing from './components/Landing/Landing.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Landing />,
      },
      {
        path: '/room',
        element: <Room />
      }
    ],
  },
])

const root = createRoot(document.getElementById('root'));

root.render(
  <RouterProvider router={router} />
)


