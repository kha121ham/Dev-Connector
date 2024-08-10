import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./component/layout/Navbar";
import Landing from "./component/layout/Landing";
import Register from "./component/auth/Register";
import Login from "./component/auth/Login";
import "./App.css";
import Alert from './component/layout/Alert';
import Dashboard from "./component/dashboard/Dashboard";
import PrivateRoute from "./component/routing/PrivateRoute";
import CreateProfile from './component/profile-form/CreateProfile';
import EditProfile from "./component/profile-form/EditProfile";
import AddExperience from "./component/profile-form/AddExperience";
import AddEducation from "./component/profile-form/AddEducation";
import Profiles from './component/profiles/Profile';
import Profile from "./component/profile/Profile";
import Posts from "./component/posts/Posts";
import Post from "./component/post/Post";
//Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utility/setAuthToken";


if (localStorage.token) {
  setAuthToken(localStorage.token)
}
const App = () => {
  useEffect(()=>{
    store.dispatch(loadUser());
  },[]);
  return (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Routes>
          <Route exact path='/' Component={Landing} />
        </Routes>
        <section className='container'>
          <Alert />
          <Routes>
            <Route exact path='/register' Component={Register} />
            <Route exact path='/login' Component={Login} />
            <Route exact path='/profiles' Component={Profiles} />
            <Route exact path='/profile/:id' Component={Profile} />
            <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path='/create-profile' element={<PrivateRoute><CreateProfile /></PrivateRoute>}  />
            <Route path='/edit-profile' element={<PrivateRoute><EditProfile /></PrivateRoute>}  />
            <Route path='/add-experience' element={<PrivateRoute><AddExperience /></PrivateRoute>}  />
            <Route path='/add-education' element={<PrivateRoute><AddEducation /></PrivateRoute>}  />
            <Route path='/posts' element={<PrivateRoute><Posts /></PrivateRoute>} />
            <Route path='/posts/:id' element={<PrivateRoute><Post /></PrivateRoute>} />
          </Routes>
          
        </section>
      </Fragment>
    </Router>
  </Provider>
)};

export default App;
