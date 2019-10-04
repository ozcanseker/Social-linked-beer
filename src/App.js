/**
 * Libs
 */
import React from 'react';
import solidAuth from 'solid-auth-client'
import {Switch, Route, Link, withRouter, Redirect} from "react-router-dom";
import SolidCommunicator from './network/SolidCommunicator'

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


/**
 * Components
 */
import NavBar from './component/NavBar';

/**
 * Assests
 */
import './css/App.scss';
import Knipsel from './assets/Knipsel.png'
import Logo from './assets/logo.png'
import BeerDetailScreen from './page/BeerDetailScreen';
import User from './model/User';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loggedIn : false,
      searchQuery : '',
      userObject: undefined,
      solidCommunicator : undefined
    }
  }

  componentDidMount(){
    this.checkLoggedIn();
  }

  clearSearchQuery = () => {
      this.setState({
        searchQuery : ''
      },)
  }

  checkLoggedIn = () => {
    solidAuth.currentSession().then( session => {
      if(session){

        //make new user
        let user = new User(session.webId);
        user.subscribe(this);

        SolidCommunicator.build(user).then(obj => {
          this.setState({
            userObject : obj.user,
            solidCommunicator : obj.solidCommunicator, 
            loggedIn: true,
          })
        });

        this.props.history.push(`/profile`)
      }
    })
  }

  onClickLogOut = () => {
    solidAuth.logout();

    this.setState({
      loggedIn : false,
      userObject : undefined
    });
  }

  onLoggedIn = () => {
    this.checkLoggedIn();
  }

  onBeerSearch = (text) => {
    let location = this.props.location.pathname;

    this.setState({
      searchQuery : text
    })

    if(text){
      if(location !== "/beerresults"){
        this.props.history.push("/beerresults");
      }

      /**
       * Vindt hier de bier
       */
    }else{
      this.props.history.goBack();
    }
  }


  render(){
    let navBar;

    if(this.state.loggedIn){
      navBar = (
         <NavBar onSearchBarButtonClick = {this.onSearchBarButtonClick} 
                 onBeerSearch = {this.onBeerSearch} 
                 loggedIn = {this.state.loggedIn} 
                 searchQuery = {this.state.searchQuery}>
          <Link to = "/profile">Profile</Link>
          <Link to = "/checkIns">Check ins</Link>
          <Link to = "/friend">Friends</Link>
          <Link to = "/groups">Groups</Link>
          <Link to = "/" onClick = {this.onClickLogOut}>Log out</Link>
        </NavBar>
      )
    }else{
      navBar = (
         <NavBar onBeerSearch = {this.onBeerSearch} loggedIn = {this.state.loggedIn}>
          <Link to = "/LogIn">Log in</Link>
        </NavBar>
      )
    }

    return (
      <div id = "AppRoot">
        <header>
          <Link to = "/">
            <div>
              <img src= {Logo} alt = ""/>
              <h1>
              Linked social beer
              </h1>
           </div>
          </Link>
        </header>

        {navBar}
          <Switch>
              <Route exact path="/" component={Home} isLoggedIn = {this.state.loggedIn}/>
              <PrivateRoute path="/user" component={UserPage} isLoggedIn = {this.state.loggedIn}/> 
              <PrivateRoute path="/beer/:id" component={BeerDetailScreen} isLoggedIn = {this.state.loggedIn}/> 
              <PrivateRoute path="/friend/:id" component={FriendsPage} isLoggedIn = {this.state.loggedIn} user = {this.state.userObject}/>                       
              <PrivateRoute exact path="/friend" component={Friends} isLoggedIn = {this.state.loggedIn} user = {this.state.userObject} solidCommunicator = {this.state.solidCommunicator}/>
              <PrivateRoute path="/beerresults" component={BeerResults} isLoggedIn = {this.state.loggedIn} onLinkClick = {this.clearSearchQuery}/>
              <PrivateRoute path="/groups" component={Groups} isLoggedIn = {this.state.loggedIn}/>
              <PrivateRoute path='/profile' component={Profile} isLoggedIn = {this.state.loggedIn} user = {this.state.userObject}/>
              <PrivateRoute path='/checkIns' component={CheckIns} isLoggedIn = {this.state.loggedIn}/>
              <PrivateRoute path='/inbox' component={Inbox} isLoggedIn = {this.state.loggedIn}/>
              <PrivateRouteLogIn path="/login" component={LogIn} isLoggedIn = {this.state.loggedIn} onLoggedIn = {this.onLoggedIn}/>
          </Switch>
          <footer>
            <span>
              This application is powered by
            </span>
              <a href="https://solid.inrupt.com">
              <img alt = "Solid inrupt" src={Knipsel} /> 
            </a>
          </footer>
      </div>
    );
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

export default withRouter(App);
