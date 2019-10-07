import React from 'react';
import '../css/User.scss'
import profilePic from '../../assets/profilePic.png';

class User extends React.Component{ 
    constructor(props){
        super(props);
        this.state = {
            clicked: false
        }
    }

    onNotJoinedButtonClick = async () => {
        let result = this.props.location.state.result;
        await this.props.solidCommunicator.inviteUserToSolib(result.url, result.inbox);

        this.setState(
            {
                clicked : true}
            );  
    }

    sendFriendShipRequest = async () => {
        let result = this.props.location.state.result;
        await this.props.solidCommunicator.sendFriendshipRequest(result.url, result.appLocation);

        this.setState(
            {
                clicked : true}
            );  
    }

    render(){
        let result = this.props.location.state.result;
        let button;

        if(!this.state.clicked){
            if(result.appLocation){
                button = (<button onClick = {this.sendFriendShipRequest}>Send friendship request</button>);
            }else{
                button = (<button onClick = {this.onNotJoinedButtonClick}>Invite to Social linked beer</button>);
            }
        }else{
            button = (<button disabled= {true}>Request send</button>)
        }

        return(
            <section className = "userPageNew">
                <div className = "userPageHead">              
                    <h1>
                        {result.name}
                    </h1>
                    <img src = {result.imageUrl ? result.imageUrl : profilePic} alt = ""/>
                </div>
                <div className = "userButtonDiv">
                    {button}
                </div>
                <div className = "userInfo">
                    <p>Uri : {result.url}</p>
                    <p>Has social linked beer account?: {result.appLocation ? "Yes" : "No"}</p>
                </div>
            </section>
        )
    }
}

export default User;
