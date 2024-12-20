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

export default function App() {
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
          path="/calendar"
          element={
            <RequireAuth>
              <CommunityCalendar></CommunityCalendar>
            </RequireAuth>
          }
        ></Route>
        <Route
          path="/calendar/create"
          element={
            <RequireAuth>
              <CreateEvent></CreateEvent>
            </RequireAuth>
          }
        ></Route>
      </Routes>
    </div>
  );
}
