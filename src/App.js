import { Route, Routes } from "react-router-dom";
import './App.css';
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import "react-bulma-components/dist/react-bulma-components.min.css";
import Dashboard from "./pages/Dashboard";
import CreateAccount from "./pages/CreateAccount";
import { WebsitePageLinks } from "./services/constants";
import ApplyLoan from "./pages/ApplyLoan";
function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path={WebsitePageLinks.signIn} element={<SignIn />} />
      <Route path={WebsitePageLinks.createAccount} element={<CreateAccount />} />
      <Route path={WebsitePageLinks.applyLoan} element={<ApplyLoan />} />
      <Route path={WebsitePageLinks.dashboard} element={<Dashboard />} />
    </Routes>
  );
}

export default App;
