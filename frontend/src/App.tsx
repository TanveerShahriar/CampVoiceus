import { Route, Routes } from "react-router-dom";
import Header from "./Pages/Shared/Header";
import Home from "./Pages/Home/Home";
import Register from "./Pages/Login/Register";
import Login from "./Pages/Login/Login";
import RequireAuth from "./Pages/Login/RequireAuth";
import CreateThreads from "./Pages/Threads/CreateThreads";
import Dashboard from "./Pages/Profile/DashBoard";
import ViewProfile from "./Pages/Profile/ViewProfile";
import ProfileEdit from "./Pages/Profile/ProfileEdit";
import CommunityCalendar from "./Pages/Calendar/CommunityCalendar";
import CreateEvent from "./Pages/Calendar/CreateEvent";
import MyEvents from "./Pages/Calendar/MyEvents";
import CreateGroup from "./Pages/Groups/CreateGroup";
import ShowAllGroups from "./Pages/Groups/ShowAllGroups";
import MyGroups from "./Pages/Groups/MyGroups";
import GroupChat from "./Pages/Groups/GroupChat";
import 'react-calendar/dist/Calendar.css';

export default function App() {
  return (
    <div>
      <Header></Header>

      <Routes>
        {/* Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Home Route */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />

        {/* Thread Routes */}
        <Route
          path="/createthread"
          element={
            <RequireAuth>
              <CreateThreads />
            </RequireAuth>
          }
        />

        

        {/* Profile Routes */}
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

        {/* Group Management Routes */}
        <Route
          path="/groups/create"
          element={
            <RequireAuth>
              <CreateGroup />
            </RequireAuth>
          }
        />
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
          path="/groups/chat/:groupId"
          element={
            <RequireAuth>
              <GroupChat />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}
