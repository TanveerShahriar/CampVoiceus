import { Route, Routes } from "react-router-dom";

import { useEffect } from "react";
import axios from "axios";
import {
  requestNotificationPermission,
  listenForNotifications,
} from "./firebase/notificationService";

import Header from "./Pages/Shared/Header";
import Home from "./Pages/Home/Home";
import Register from "./Pages/Login/Register";
import Login from "./Pages/Login/Login";
import RequireAuth from "./Pages/Login/RequireAuth";
import CreateThreads from "./Pages/Threads/CreateThreads";
import Dashboard from "./Pages/Profile/DashBoard";
import ViewProfile from "./Pages/Profile/ViewProfile";
import ProfileEdit from "./Pages/Profile/ProfileEdit";
import ThreadDetails from "./Pages/Home/ThreadDetails";



export default function App() {
  useEffect(() => {
    const initializeNotifications = async () => {
      const fcmToken = await requestNotificationPermission();
      const authToken = localStorage.getItem("token");
  
      console.log("fcmToken", fcmToken);
      console.log("authToken", authToken);
  
      if (fcmToken && authToken) {
        try {
          await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/users/savefcmtoken`,
            { fcmToken },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          console.log("FCM token saved successfully.");
        } catch (error) {
          console.error("Error saving FCM token:", error);
        }
      }
    };
  
    initializeNotifications();
    listenForNotifications();
  }, []);
  

  return (
    <div>
      <Header></Header>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home></Home>
            </RequireAuth>
          }
        ></Route>

        <Route
          path="/createthread"
          element={
            <RequireAuth>
              <CreateThreads></CreateThreads>
            </RequireAuth>
          }
        ></Route>

        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard></Dashboard>
            </RequireAuth>
          }
        ></Route>
        <Route
          path="/profile/:username"
          element={
            <RequireAuth>
              <ViewProfile></ViewProfile>
            </RequireAuth>
          }
        ></Route>
        <Route
          path="/profile/edit"
          element={
            <RequireAuth>
              <ProfileEdit></ProfileEdit>
            </RequireAuth>
          }
        ></Route>
        <Route
          path="/threadDetails/:threadId"
          element={
            <RequireAuth>
              <ThreadDetails></ThreadDetails>
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}
