import { Route, Routes } from "react-router-dom";
import Header from "./Pages/Shared/Header";
import Home from "./Pages/Home/Home";
import Register from "./Pages/Login/Register";
import Login from "./Pages/Login/Login";
import RequireAuth from "./Pages/Login/RequireAuth";
import CreateThreads from "./Pages/Threads/CreateThreads";

export default function App() {
  return (
    <div>
      <Header></Header>

      <Routes>
        <Route path='/' element={
            <RequireAuth>
              <Home></Home>
            </RequireAuth>
          }>
        </Route>

        <Route path='/createthread' element={
            <RequireAuth>
              <CreateThreads></CreateThreads>
            </RequireAuth>
          }>
        </Route>

        <Route path='/register' element={
            <Register></Register>
          }>
        </Route>

        <Route path='/login' element={
            <Login></Login>
          }>
        </Route>
      </Routes>
    </div>
  )
}