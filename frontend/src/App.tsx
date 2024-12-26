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
import ShowAllGroups from "./Pages/Groups/AllGroups";
import MyGroups from "./Pages/Groups/MyGroups";
import GroupPosts from "./Pages/Groups/GroupPosts";
import 'react-calendar/dist/Calendar.css';
import CreatePost from "./Pages/Groups/CreatePost";

export default function App() {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

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
          path="/groups/:groupId"
          element={
            <RequireAuth>
              <GroupPosts />
            </RequireAuth>
          }
        />
        <Route
    path="/groups/:groupId/createpost"
    element={
      <RequireAuth>
        <CreatePost />
      </RequireAuth>
    }
  />
      </Routes>
    </div>
  );
}
