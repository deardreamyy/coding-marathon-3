import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

// pages & components
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/HomePage";
import AddJobPage from "./pages/AddJobPage";
import JobPage from "./pages/JobPage";
import EditJobPage from "./pages/EditJobPage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.token ? true : false;
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/jobs/add-job" element={<AddJobPage />} />
        <Route path="/edit-job/:id" element={isAuthenticated ? <EditJobPage /> : <Navigate to = "/signup"/>} />
        <Route path="/jobs/:id" element={<JobPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;