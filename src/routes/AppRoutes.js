import React from 'react';

import {Switch, Route, withRouter, Redirect} from "react-router-dom";


/**
 * Imported Pages
 */
import Home from './page/Home'
import LogIn from './page/LogIn'
import Groups from './page/Groups';
import Friends from './page/Friends';
import FriendsPage from './page/FriendPage';
import CheckIns from './page/CheckIns';
import BeerResults from './page/BeerResults';
import Profile from './page/Profile';
import UserPage from './page/User';
import Inbox from './page/Inbox';
import BeerDetailScreen from './page/BeerDetailScreen';

class AppRoutes extends React.Component{
    render(){
  	  return(
         <Switch>
              <Route exact path="/" component={Home} isLoggedIn = {this.props.loggedIn} solidCommunicator = {this.props.solidCommunicator}/>
              <PrivateRoute path="/user" component={UserPage} isLoggedIn = {this.props.loggedIn} solidCommunicator = {this.props.solidCommunicator}/> 
              <PrivateRoute path="/beer/:id" component={BeerDetailScreen} isLoggedIn = {this.props.loggedIn} solidCommunicator = {this.props.solidCommunicator}/> 
              <PrivateRoute exact path="/friend" component={Friends} isLoggedIn = {this.props.loggedIn} user = {this.props.userObject} solidCommunicator = {this.props.solidCommunicator}/>
              <PrivateRoute path="/friend/:id" component={FriendsPage} isLoggedIn = {this.props.loggedIn} user = {this.props.userObject}/>
              <PrivateRoute path="/beerresults" component={BeerResults} isLoggedIn = {this.props.loggedIn} onLinkClick = {this.props.clearSearchQuery} solidCommunicator = {this.props.solidCommunicator}/>
              <PrivateRoute path="/groups" component={Groups} isLoggedIn = {this.props.loggedIn}/>
              <PrivateRoute path='/profile' component={Profile} isLoggedIn = {this.props.loggedIn} user = {this.props.userObject}/>
              <PrivateRoute path='/checkIns' component={CheckIns} isLoggedIn = {this.props.loggedIn}/>
              <PrivateRoute path='/inbox' component={Inbox} isLoggedIn = {this.props.loggedIn} solidCommunicator = {this.props.solidCommunicator}/>
              <PrivateRouteLogIn path="/login" component={LogIn} isLoggedIn = {this.props.loggedIn} onLoggedIn = {this.props.onLoggedIn}/>
          </Switch>)
    }
}

const PrivateRoute = ({ component: Component, isLoggedIn ,...rest }) => (
    <Route {...rest} render={(props) => (
      isLoggedIn
      ?   <Component {...props} {...rest}/>
      : <Redirect to='/' />
    )} />
  )
  
  const PrivateRouteLogIn = ({ component: Component, isLoggedIn, onLoggedIn ,...rest }) => (
    <Route {...rest} render={(props) => (
      !isLoggedIn
        ? <Component onLoggedIn = {onLoggedIn} {...props} />
        : <Redirect to='/profile' />
    )} />
  )

export default withRouter(AppRoutes);