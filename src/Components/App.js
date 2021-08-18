import './App.css';
import Navibar from './main/Nvibar';
import Main from './main/Main';
import Inbox from './DM/Inbox';
import Profile from './Profile/Profile';
import Edit from './Profile/Edit';
import Signup from './SignUp/Signup';
import Login from './SignUp/Login';
import Upload from './SignUp/Upload';
import {AuthProvider} from "../context/AuthContext";

import PrivateRoute from './PrivateRoute';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  
  return (
      <div className="App">
        <Router>
          <AuthProvider>
            <PrivateRoute path="/" component={Navibar}/>
            <Switch>
              <PrivateRoute exact path="/" component={Main} />
              <PrivateRoute path="/inbox" component={Inbox} />
              <PrivateRoute path="/profile" component={Profile} />
              <PrivateRoute path="/edit" component={Edit} />
              <Route exact path="/signup" component={Signup}/>
              <Route exact path="/signupdata" component={Upload}/>
              <Route exact path="/login" component={Login}/>
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    
  );
}

export default App;
