import logo from './logo.svg';
import './App.css';
import "./style.scss"

import Home from "./components/home";
import Login from "./components/login";
import Navbar from "./components/nav";
import Register from "./components/register";
import Pomo from "./components/pomodoro";
import Schedule from "./components/schedule";
import Tasks from "./components/tasks";

import { AuthProvider } from './context/AuthContext';
// import use routes

function App() {

  const routesArray = [
    {
      path: "*",
      element: <Home />,
    },
    {
      path: "/pomodoro",
      element: <Pomo />,
    },
    {
      path: "/schedule",
      element: <Schedule />,
    },
    {
      path: "/tasks",
      element: <Tasks />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/upload",
      element: <Upload/>,
    },
    {
      path: "/header",
      element: <Navbar />,
    },
  ];

  return (
    <div>
      <AuthProvider>
        
      </AuthProvider>
    </div>
  );

  
}

export default App;


// return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
