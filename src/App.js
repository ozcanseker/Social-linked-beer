/**
 * Libs
 */
import React from 'react';
import solidAuth from 'solid-auth-client'
import {Link, withRouter} from "react-router-dom";
import SolidCommunicator from './network/SolidCommunicator'

import AppRoutes from './routes/AppRoutes'

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

  update = () => {
    this.setState({
      update : true
    })
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

        SolidCommunicator.build(user).then(solidCommunicator => {
          this.setState({
            userObject : user,
            solidCommunicator : solidCommunicator, 
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
          <Link to = "/inbox">Inbox</Link>
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
        <AppRoutes 
          loggedIn = {this.state.loggedIn}
          userObject = {this.state.userObject}
          solidCommunicator = {this.state.solidCommunicator}
          clearSearchQuery = {this.clearSearchQuery}
          onLoggedIn = {this.onLoggedIn}
        />
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

export default withRouter(App);
