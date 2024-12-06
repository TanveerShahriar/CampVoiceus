import { Route, Routes } from "react-router-dom";
import Header from "./Pages/Shared/Header";
import Home from "./Pages/Home/Home";
import Register from "./Pages/Login/Register";
import Login from "./Pages/Login/Login";

export default function App() {
  return (
    <div>
      <Header></Header>

      <Routes>
        <Route path='/' element={
            <Home></Home>
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