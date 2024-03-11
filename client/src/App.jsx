import { BrowserRouter, Route, Routes } from 'react-router-dom';
import About from './components/About/About.jsx';
import Home from './components/Home/Home.jsx';
import Login from './components/auth/Login.jsx';
import NavBar from './components/Navbar/NavBar.jsx';
import ProblemDetails from './components/Problem/ProblemDetails.jsx';
import Problemset from './components/ProblemSet/Problemset.jsx';
import SignUp from './components/auth/SignUp.jsx';
import NotFound from './components/NotFound/NotFound.jsx';
import Contests from './components/ContestSet/Contests.jsx';
import ContestDetails from './components/Contest/ContestDetails.jsx';
import LoggedIn from './components/auth/LoggedIn.jsx';
import ScrollToTop from './components/utils/ScrollToTop.jsx';
import ProtectedRoutes from './components/auth/ProtectedRoutes.jsx';
import ShowNavBar from './components/Navbar/ShowNavbar.jsx';
import AddProblem from './components/AddProblem/AddProblem.jsx';
import Profile from './components/Profile/Profile.jsx';
import UserSubmissions from './components/Profile/UserSubmissions.jsx';
import RefrechUser from './components/auth/RefreshUser.jsx';
import EditProfile from './components/Profile/EditProfile.jsx';
import PublicRoutes from './components/auth/PublicRoutes.jsx';
import RoleBasedRoute from './components/auth/RoleBasedRoute.jsx';
import { QueryClient, QueryClientProvider  } from '@tanstack/react-query' ;
import { ReactQueryDevtools } from '@tanstack/react-query-devtools' ;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    
      <RefrechUser>
        <div className="App">
          <ShowNavBar>
            <NavBar />
          </ShowNavBar>
          <div className="app-content">
            <Routes>
              <Route path='/' element={<Home />}></Route>
              <Route path='/about' element={<About />}></Route>
              <Route path='/problemset' element={<Problemset />}></Route>
              <Route path='/problemset/:id' element={<ProblemDetails />}></Route>
              <Route path='/contests/:id/:id' element={<ProblemDetails />}></Route>
              <Route path='/contests/:id' element={<ContestDetails />}></Route>
              <Route path='/contests' element={<Contests />}></Route>

              <Route element={<ProtectedRoutes />}>
                {/* protected routes here */}
                <Route path='/loggedin' element={<LoggedIn />}></Route>
                <Route element={<RoleBasedRoute roles={['mod','admin']} />} >
                  <Route path='/problemset/add-problem' element={<AddProblem />}></Route>
                </Route>
                
                <Route path='/profile/:username/edit' element={<EditProfile />}></Route>
              </Route>
              
              <Route path='/profile/:username' element={<Profile />}></Route>
              <Route path='/profile/:id/submissions' element={<UserSubmissions />}></Route>
              


              <Route element={<PublicRoutes />}>
                {/* public routes here */}
                <Route path='/login' element={<Login />}></Route>
                <Route path='/signup' element={<SignUp />}></Route>
              </Route>

              <Route path='*' element={<NotFound />}></Route>
            </Routes>
          </div>
          <ShowNavBar>
            <footer>
              <p>
                &copy;  2023 CPC Enicarthage <br />
                All rights reserved.
              </p>
            </footer>
          </ShowNavBar>
        </div>
        <ScrollToTop />
      </RefrechUser>
    <ReactQueryDevtools initialIsOpen panelProps={{style: {backgroundColor: 'white'}}} />

    </BrowserRouter>
    </QueryClientProvider>

  );
}

export default App
