import React from 'react';
import '../css/LogIn.scss'

import solidAuth from 'solid-auth-client'

/**
 * This is the login screen
 */
class LogIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginAsBrewer: false
        }
    }

    /**
     * When the check box gets clicked
     */
    onChangeCheckBox = () => {
        this.setState({
            loginAsBrewer: !this.state.loginAsBrewer
        })
    };

    /**
     * When the login button gets clicked
     */
    onButtonClick = () => {
        let popupUri = './popup.html';
        solidAuth.popupLogin({ popupUri }).then(() => {
            solidAuth.currentSession().then(session => {
                this.props.onLoggedIn();
                this.props.history.push(`/profile`)
            })
        })
    };

    /**
     * When the register button gets clicked.
     */
    onRegisterClick = () => {
        window.location.assign('https://inrupt.net/');
    };

    render() {
        let typeLogIn;
        let loginButton;

        if (this.state.loginAsBrewer) {
            typeLogIn = (<h1>Brewer</h1>);
            loginButton = (<button onClick = {this.onButtonClick} disabled={true}>In progress</button>);
        } else {
            typeLogIn = (<h1>Beer Drinker</h1>);
            loginButton = (<button onClick = {this.onButtonClick}>Log in</button>);
        }

        let activeClass = this.state.loginAsBrewer ? "logInBrewer" : "logInBeerDrinker";

        return (
            <section className={["logInScreen ", activeClass].join(' ')}>
                <div className="loginField">
                    {typeLogIn}
                    <label className="switch">
                        <input type="checkbox" onChange={this.onChangeCheckBox} />
                        <span className="slider"/>
                    </label>

                    <br />
                    <div>
                        <button onClick = {this.onRegisterClick}>Register</button>
                        {loginButton}
                    </div>

                </div>
            </section>
        )
    }
}

export default LogIn;
