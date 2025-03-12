import { createBrowserRouter } from 'react-router-dom';
import Dashboard from 'pages/dashboard';  // Import your Dashboard component
import Error404 from 'pages/errors/Error404';  // Import your 404 Error page

// Simple routing configuration
const routes = [
  {
    path: '/',
    element: <Dashboard />,  // Directly render the Dashboard at the root
  },
  {
    path: '*',  // Catch-all for any invalid paths
    element: <Error404 />,  // Display 404 Error page
  },
];

const router = createBrowserRouter(routes);  // Basic browser router without basename

export default router;
