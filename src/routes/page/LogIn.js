import React from 'react';
import '../css/LogIn.scss'

import solidAuth from 'solid-auth-client'

class LogIn extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loginAsBrewer : false
        }
    }

    onChangeCheckBox = () =>{
        this.setState({
            loginAsBrewer : !this.state.loginAsBrewer
        })
    }

    onButtonClick = () => {
        let popupUri = './popup.html';
        solidAuth.popupLogin({ popupUri }).then(() => {
            solidAuth.currentSession().then( session => {
                this.props.onLoggedIn();
                this.props.history.push(`/profile`)
            })
        })
    }

    render(){
        let typeLogIn;
        
        if(this.state.loginAsBrewer){
            typeLogIn = <p>Brewer</p>
        }else{
            typeLogIn = <p>Beer Drinker</p>
        }


        return(
            <section id = {this.state.loginAsBrewer ? "logInBrewer" : "logInBeerDrinker"}>
                <label className="switch">
                    <input type="checkbox" onChange= {this.onChangeCheckBox}/>
                    <span className="slider"></span>
                </label>

                {typeLogIn}
                <button onClick = {this.onButtonClick}>Log in</button>
                <p><a href= "https://inrupt.net">register</a></p>
            </section>
        )
    }
}

export default LogIn;
