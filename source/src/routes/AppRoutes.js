import React from 'react';

import {Switch, Route, withRouter, Redirect} from "react-router-dom";
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
import BrewerPage from './page/BrewerPage';
import GroupDetail from "./page/GroupDetail";

/**
 * This page holds all the routes to different pages.
 */
class AppRoutes extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/"
                       component={Home}
                       isLoggedIn={this.props.loggedIn}
                       solidCommunicator={this.props.solidCommunicator}/>
                <PrivateRoute path="/user"
                              component={UserPage}
                              isLoggedIn={this.props.loggedIn}
                              solidCommunicator={this.props.solidCommunicator}
                              modelHolder={this.props.modelHolder}/>
                <PrivateRoute path="/beer/:id"
                              component={BeerDetailScreen}
                              isLoggedIn={this.props.loggedIn}
                              solidCommunicator={this.props.solidCommunicator}
                              modelHolder={this.props.modelHolder}/>
                <PrivateRoute path="/brewer/:id"
                              component={BrewerPage}
                              isLoggedIn={this.props.loggedIn}
                              solidCommunicator={this.props.solidCommunicator}
                              modelHolder={this.props.modelHolder}/>
                <PrivateRoute exact path="/friend"
                              component={Friends}
                              isLoggedIn={this.props.loggedIn}
                              modelHolder={this.props.modelHolder}
                              solidCommunicator={this.props.solidCommunicator}/>
                <PrivateRoute path="/friend/:id"
                              component={FriendsPage}
                              isLoggedIn={this.props.loggedIn}
                              modelHolder={this.props.modelHolder}/>
                <PrivateRoute path="/beerresults"
                              component={BeerResults}
                              isLoggedIn={this.props.loggedIn}
                              onLinkClick={this.props.clearSearchQuery}
                              solidCommunicator={this.props.solidCommunicator}
                              modelHolder={this.props.modelHolder}
                              searchQuery = {this.props.searchQuery}
                              onBeerSearch = {this.props.onBeerSearch}
                />
                <PrivateRoute path="/groups/:id"
                              component={GroupDetail}
                              isLoggedIn={this.props.loggedIn}
                              modelHolder={this.props.modelHolder}
                              solidCommunicator={this.props.solidCommunicator}/>
                <PrivateRoute exact path="/groups"
                              component={Groups}
                              isLoggedIn={this.props.loggedIn}
                              modelHolder={this.props.modelHolder}
                              solidCommunicator={this.props.solidCommunicator}/>
                <PrivateRoute path='/profile'
                              component={Profile}
                              isLoggedIn={this.props.loggedIn}
                              modelHolder={this.props.modelHolder}/>
                <PrivateRoute path='/checkIns'
                              component={CheckIns}
                              isLoggedIn={this.props.loggedIn}
                              solidCommunicator={this.props.solidCommunicator}
                              modelHolder={this.props.modelHolder}/>
                <PrivateRoute path='/inbox'
                              component={Inbox}
                              isLoggedIn={this.props.loggedIn}
                              solidCommunicator={this.props.solidCommunicator}
                              modelHolder={this.props.modelHolder}/>
                <PrivateRouteLogIn path="/login"
                                   component={LogIn}
                                   isLoggedIn={this.props.loggedIn}
                                   onLoggedIn={this.props.onLoggedIn}/>
            </Switch>)
    }
}

/**
 * This is a private route that you can not enter if you are not logged in
 * @param Component
 * @param isLoggedIn
 * @param rest
 * @returns {*}
 * @constructor
 */
const PrivateRoute = ({component: Component, isLoggedIn, ...rest}) => (
    <Route {...rest} render={(props) => (
        isLoggedIn
            ? <Component {...props} {...rest}/>
            : <Redirect to='/'/>
    )}/>
);

/**
 * This is a private route you can not enter if you are logged in.
 * @param Component
 * @param isLoggedIn
 * @param onLoggedIn
 * @param rest
 * @returns {*}
 * @constructor
 */
const PrivateRouteLogIn = ({component: Component, isLoggedIn, onLoggedIn, ...rest}) => (
    <Route {...rest} render={(props) => (
        !isLoggedIn
            ? <Component onLoggedIn={onLoggedIn} {...props} />
            : <Redirect to='/profile'/>
    )}/>
)

export default withRouter(AppRoutes);