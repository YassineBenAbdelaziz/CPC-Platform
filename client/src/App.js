import { BrowserRouter, Route, Routes } from 'react-router-dom';
import About from './About';
import Home from './Home';
import Login from './Login';
import NavBar from './NavBar';
import ProblemDetails from './ProblemDetails';
import Problemset from './Problemset';
import SignUp from './SignUp';
import NotFound from './NotFound';
import Contests from './Contests';
import ContestDetails from './ContestDetails';
import LoggedIn from './LoggedIn';
import ScrollToTop from './ScrollToTop';
import ProtectedRoutes from './ProtectedRoutes';
import ShowNavBar from './ShowNavbar';
import AddProblem from './AddProblem';
import Profile from './Profile';
import UserSubmissions from './UserSubmissions';
import RefrechUser from './RefreshUser';
import EditProfile from './EditProfile';
import PublicRoutes from './PublicRoutes';
import RoleBasedRoute from './RoleBasedRoute';
import { QueryClient, QueryClientProvider  } from '@tanstack/react-query' ;
import { ReactQueryDevtools } from '@tanstack/react-query-devtools' ;


const queryClient = new QueryClient();


function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    
      <RefrechUser>
        <div className="App" style={{ minHeight: '633px' }}>
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
      <ReactQueryDevtools initialIsOpen />
    
    </BrowserRouter>
    </QueryClientProvider>

  );
}

export default App;
