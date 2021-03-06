import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {infoToast} from "./component/ToastMethods";

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
import FetchingComponent from './component/FetchingComponent';

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
import StandardContext from "./context/StandardContext";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            modelHolder: new ModelHolder(),
            solidCommunicator: undefined,
            accessError: false,
            fetchingFiles: false
        };

        this.state.modelHolder.subscribe(this);

        console.log("version 0.6.5");
    }

    componentDidMount() {
        this.checkLoggedIn();
    }

    update = () => {
        this.setState({
            modelHolder: this.state.modelHolder
        })
    };

    /**
     * Checks if the user is logged in.
     * @returns {Promise<void>}
     */
    checkLoggedIn = async () => {
        let session = await solidAuth.currentSession();

        if (session) {
            //if logged in

            this.setState({
                fetchingFiles: true
            });

            //make new user
            this.state.modelHolder.getUser().setUri(session.webId);

            //make solid communicator
            try {
                let solidCommunicator = await SolidCommunicator.build(this.state.modelHolder);

                this.setState({
                    solidCommunicator: solidCommunicator,
                    loggedIn: true,
                    fetchingFiles: false
                });

                this.props.history.push(`/`);

                infoToast("logged in as " + this.state.modelHolder.getUser().getUri());
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

    /**
     * This gets called when you click on the logout button
     */
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

    onCheckInButtonClick = () => {
        this.props.history.push("/beerresults");
    };

    render() {
        let navBar;
        let app;

        if (this.state.fetchingFiles) {
            navBar = (
                <NavBar onSearchBarButtonClick={this.onCheckInButtonClick}>
                    <Link to="/">&nbsp;</Link>
                </NavBar>)
        } else if (this.state.accessError) {
            navBar = (
                <NavBar onSearchBarButtonClick={this.onCheckInButtonClick}>
                    <Link to="/" onClick={this.onClickLogOut}>Log out</Link>
                </NavBar>)
        } else if (this.state.loggedIn) {
            navBar = (
                <NavBar onSearchBarButtonClick={this.onCheckInButtonClick}
                        onBeerSearch={this.onBeerSearch}
                        loggedIn={this.state.loggedIn}>
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
            app = (<FetchingComponent/>);
        } else if (this.state.accessError) {
            app = (<AclErrorPage/>);
        } else {
            app = (
                <StandardContext.Provider value={{solidCommunicator : this.state.solidCommunicator}}>
                    <AppRoutes
                        loggedIn={this.state.loggedIn}
                        modelHolder={this.state.modelHolder}
                        solidCommunicator={this.state.solidCommunicator}
                        clearSearchQuery={this.clearSearchQuery}
                        onLoggedIn={this.onLoggedIn}
                        searchQuery={this.state.searchQuery}
                        onBeerSearch={this.onBeerSearch}
                    />
                </StandardContext.Provider>
            )
        }

        return (
            <div id="AppRoot">
                <header>
                    <Link to="/">
                        <img alt = "Social linked beer logo" src={Logo}/>
                    </Link>
                    {navBar}
                </header>
                {app}
                <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover={false}
                />
                <footer>
          <span>
            This application works with
            </span>
                    <a href="https://solid.inrupt.com" target="_blank" rel="noopener noreferrer">
                        <img alt="Solid inrupt" src={Knipsel}/>
                    </a>
                </footer>
            </div>
        );
    }
}

export default withRouter(App);
