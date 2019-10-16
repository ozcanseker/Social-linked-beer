import React from 'react';
import '../css/LogIn.scss'

import solidAuth from 'solid-auth-client'

class LogIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginAsBrewer: false
        }
    }

    onChangeCheckBox = () => {
        this.setState({
            loginAsBrewer: !this.state.loginAsBrewer
        })
    }

    onButtonClick = () => {
        let popupUri = './popup.html';
        solidAuth.popupLogin({ popupUri }).then(() => {
            solidAuth.currentSession().then(session => {
                this.props.onLoggedIn();
                this.props.history.push(`/profile`)
            })
        })
    }

    onRegisterClick = () => {
        window.location.assign('https://inrupt.net/');
    }

    render() {
        let typeLogIn;

        if (this.state.loginAsBrewer) {
            typeLogIn = <h1>Brewer</h1>
        } else {
            typeLogIn = <h1>Beer Drinker</h1>
        }

        let activeClass = this.state.loginAsBrewer ? "logInBrewer" : "logInBeerDrinker";

        return (
            <section className={["logInScreen ", activeClass].join(' ')}>
                <div className="loginField">
                    {typeLogIn}
                    <label className="switch">
                        <input type="checkbox" onChange={this.onChangeCheckBox} />
                        <span className="slider"></span>
                    </label>

                    <br />
                    <div>
                        <button onClick = {this.onRegisterClick}>Register</button>
                        <button onClick = {this.onButtonClick}>Log in</button>
                    </div>

                </div>
            </section>
        )
    }
}

export default LogIn;
