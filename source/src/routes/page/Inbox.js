import React from 'react';
import "../css/Inbox.scss";

class Inbox extends React.Component{
    constructor(props){
        super(props);
    }

    declineFriendShipRequest = (index, message) => {
        this.props.modelHolder.spliceAtIndex(index);
        this.props.solidCommunicator.declineFriendSchipRequest(message);
    };

    acceptFriendShipRequest = (index, message) => {
        this.props.modelHolder.spliceAtIndex(index);
        this.props.solidCommunicator.acceptFriendSchipRequest(message);
    };

    declineGroupRequest = (index, message) => {
        this.props.modelHolder.spliceAtIndex(index);
        this.props.solidCommunicator.declineGroupRequest(message);
    };

    acceptGroupRequest = (index, message) => {
        this.props.modelHolder.spliceAtIndex(index);
        this.props.solidCommunicator.acceptGroupRequest(message);
    };

    componentDidMount() {
        this.props.solidCommunicator.getInboxContents();
    }

    render(){
        let items = this.props.modelHolder.getInboxMessages().map((message, index)=> {
            let buttonDiv;

            if(message.getType() === "FriendshipRequest"){
                buttonDiv = (<div className = "buttonDiv">
                    <button onClick = {() => this.declineFriendShipRequest(index,message)}>Decline</button>
                    <button onClick = {() => this.acceptFriendShipRequest(index, message)}>Accept</button>
                </div>)
            }else if(message.getType() === "GroupInvitation"){
                buttonDiv = (<div className = "buttonDiv">
                    <button onClick = {() => this.declineGroupRequest(index,message)}>Decline</button>
                    <button onClick = {() => this.acceptGroupRequest(index, message)}>Accept</button>
                </div>)
            }

            return (<li key = {message.getUri()}>
                <h4>{message.getType()}</h4>
                <p>{message.getFrom() ? "from :" + message.getFrom(): "fetching file"}</p>
                <p>{message.getDesc()}</p>
                {buttonDiv}
            </li>)
        })

        return(
            <section className = "inbox">
                <h1>
                    Inbox
                </h1>

                <ul>
                    {items}
                </ul>
                
            </section>
        )
    }
}

export default Inbox;
