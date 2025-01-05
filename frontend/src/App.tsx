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
import ThreadDetails from "./Pages/ThreadDetails/ThreadDetails"
import CommunityCalendar from "./Pages/Calendar/CommunityCalendar";
import CreateEvent from "./Pages/Calendar/CreateEvent";
import MyEvents from "./Pages/Calendar/MyEvents";
import ShowAllGroups from "./Pages/Groups/ShowAllGroups";
import MyGroups from "./Pages/Groups/MyGroups";
import CreateGroup from "./Pages/Groups/CreateGroup";
import GroupPage from "./Pages/Groups/GroupPage";
import CreateGroupThread from "./Pages/Groups/CreateGroupThread";
import "react-calendar/dist/Calendar.css";
import Notifications from "./Pages/Notifications/Notifications";
import ThreadsByTag from "./Pages/Tag/ThreadsByTag";
import ExpertiseEdit from "./Pages/Profile/ExpertiseEdit";
import CreateQna from "./Pages/Threads/CreateQna";

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
      <Header />

      <Routes>
        {/* Authentication Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/createthread"
          element={
            <RequireAuth>
              <CreateThreads />
            </RequireAuth>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <RequireAuth>
              <ViewProfile />
            </RequireAuth>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <RequireAuth>
              <ProfileEdit />

            </RequireAuth>
          }
        />

        <Route
          path="/notifications"
          element={
            <RequireAuth>
              <Notifications />

            </RequireAuth>
          }
        />

        <Route
          path="/tag/:tag"
          element={
            <RequireAuth>
              <ThreadsByTag />

            </RequireAuth>
          }
        />

        <Route
          path="/expertise/edit"
          element={
            <RequireAuth>
              <ExpertiseEdit />
            </RequireAuth>
          }
        />

        <Route
          path="/createqna"
          element={
            <RequireAuth>
              <CreateQna />
            </RequireAuth>
          }
        />

        <Route
          path="/threadDetails/:threadId"
          element={
            <RequireAuth>
              <ThreadDetails />
            </RequireAuth>
          }
        />

        {/* Calendar Routes */}
        <Route
          path="/calendar"
          element={
            <RequireAuth>
              <CommunityCalendar />
            </RequireAuth>
          }
        />
        <Route
          path="/calendar/create"
          element={
            <RequireAuth>
              <CreateEvent />
            </RequireAuth>
          }
        />
        <Route
          path="/myevents"
          element={
            <RequireAuth>
              <MyEvents />
            </RequireAuth>
          }
        />

        {/* Group Routes */}
        <Route
          path="/groups"
          element={
            <RequireAuth>
              <ShowAllGroups />
            </RequireAuth>
          }
        />
        <Route
          path="/groups/mine"
          element={
            <RequireAuth>
              <MyGroups />
            </RequireAuth>
          }
        />
        <Route
          path="/groups/create"
          element={
            <RequireAuth>
              <CreateGroup />
            </RequireAuth>
          }
        />
        <Route
          path="/groups/:groupId"
          element={
            <RequireAuth>
              <GroupPage />
            </RequireAuth>
          }
        />
        <Route
          path="/groups/:groupId/createthread"
          element={
            <RequireAuth>
              <CreateGroupThread />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );  
}
