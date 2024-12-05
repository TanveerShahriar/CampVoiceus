import { Route, Routes } from "react-router-dom";
import Header from "./Pages/Shared/Header";
import Home from "./Pages/Home/Home";

export default function App() {
  return (
    <div>
      <Header></Header>

      <Routes>
        <Route path='/' element={
            <Home></Home>
          }></Route>
      </Routes>
    </div>
  )
}