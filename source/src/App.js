/**
 * Libs
 */
import React from 'react';
import solidAuth from 'solid-auth-client';
import {Link, withRouter} from "react-router-dom";
import SolidCommunicator from './solid/SolidCommunicator';

/**
 * Components
 */
import NavBar from './component/NavBar';
import AppRoutes from './routes/AppRoutes';
import AclErrorPage from './routes/extrapage/AclErrorPage';
import FetchingPage from './routes/extrapage/FetchingPage';

/**
 * Errors
 */
import AccessError from './error/AccessError';

/**
 * Assests
 */
import './App.scss';
import Knipsel from './assets/Knipsel.png';
import ModelHolder from "./model/ModelHolder";
import Logo from "./assets/logo.png";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            searchQuery: '',
            modelHolder: new ModelHolder(),
            solidCommunicator: undefined,
            accessError: false,
            fetchingFiles: false
        };

        this.state.modelHolder.subscribe(this);
    }

    componentDidMount() {
        this.checkLoggedIn();
    }

    update = () => {
        this.setState({
            modelHolder: this.state.modelHolder
        })
    };

    clearSearchQuery = () => {
        this.setState({
            searchQuery: ''
        })
    };

    checkLoggedIn = async () => {
        let session = await solidAuth.currentSession();
        //TODO error handling

        if (session) {
            this.setState({
                fetchingFiles: true
            });

            //make new user
            this.state.modelHolder.getUser().setUri(session.webId);

            try {
                let solidCommunicator = await SolidCommunicator.build(this.state.modelHolder);

                this.setState({
                    solidCommunicator: solidCommunicator,
                    loggedIn: true,
                    fetchingFiles: false
                });

                this.props.history.push(`/profile`)
            } catch (e) {
                if (e instanceof AccessError) {
                    this.setState({
                        accessError: true,
                        fetchingFiles: false
                    })
                } else {
                    throw e; // let others bubble up
                }
            }
        }
    };

    onClickLogOut = () => {
        solidAuth.logout().then(res => {
            this.state.modelHolder.clearAll();

            this.setState({
                loggedIn: false,
                userObject: undefined,
                accessError: false
            });
        });
    };

    onLoggedIn = () => {
        this.checkLoggedIn();
    };

    onBeerSearch = (text) => {
        let location = this.props.location.pathname;

        this.setState({
            searchQuery: text
        });

        if (text) {
            if (location !== "/beerresults") {
                this.props.history.push("/beerresults");
            }

            /**
             * Vindt hier de bier
             */
        } else {
            this.props.history.goBack();
        }
    };

    onDeleteButtonClicked = () =>{
      this.clearSearchQuery();
      if (this.props.location.pathname === "/beerresults") {
        this.props.history.goBack();
      }
    }

    render() {
        let navBar;
        let app;

        if (this.state.fetchingFiles) {
            navBar = (
                <NavBar onSearchBarButtonClick={this.onDeleteButtonClicked}>
                    <Link to="/">&nbsp;</Link>
                </NavBar>)
        } else if (this.state.accessError) {
            navBar = (
                <NavBar onSearchBarButtonClick={this.onDeleteButtonClicked}>
                    <Link to="/" onClick={this.onClickLogOut}>Log out</Link>
                </NavBar>)
        } else if (this.state.loggedIn) {
            navBar = (
                <NavBar onSearchBarButtonClick={this.onDeleteButtonClicked}
                        onBeerSearch={this.onBeerSearch}
                        loggedIn={this.state.loggedIn}
                        searchQuery={this.state.searchQuery}>
                    <Link to="/profile">Profile</Link>
                    <Link to="/friend">Friends</Link>
                    <Link to="/groups">Groups</Link>
                    <Link to="/inbox">Inbox</Link>
                    <Link to="/" onClick={this.onClickLogOut}>Log out</Link>
                </NavBar>
            )
        } else {
            navBar = (
                <NavBar onBeerSearch={this.onBeerSearch} loggedIn={this.state.loggedIn}>
                    <Link to="/LogIn">Log in</Link>
                </NavBar>
            )
        }

        if (this.state.fetchingFiles) {
            app = (<FetchingPage/>);
        } else if (this.state.accessError) {
            app = (<AclErrorPage/>);
        } else {
            app = (<AppRoutes
                loggedIn={this.state.loggedIn}
                modelHolder={this.state.modelHolder}
                solidCommunicator={this.state.solidCommunicator}
                clearSearchQuery={this.clearSearchQuery}
                onLoggedIn={this.onLoggedIn}
            />)
        }

        return (
            <div id="AppRoot">
                <header>
                    <Link to="/">
                        <img src={Logo}/>
                    </Link>
                    {navBar}
                </header>

                {app}
                <footer>
          <span>
            This application works with
            </span>
                    <a href="https://solid.inrupt.com">
                        <img alt="Solid inrupt" src={Knipsel}/>
                    </a>
                </footer>
            </div>
        );
    }
}

export default withRouter(App);
