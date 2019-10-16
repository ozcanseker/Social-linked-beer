import React from 'react';
import "../css/Inbox.scss";

class Inbox extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            messages : []
        }
    }

    declineFriendShipRequest = async (index, message) => {
        let array = this.state.messages;
        array.splice(index, 1);
        this.setState({messages: array})

        await this.props.solidCommunicator.declineFriendSchipRequest(message);
    }

    acceptFriendShipRequest = async (index, message) => {
        let array = this.state.messages;
        array.splice(index, 1);
        this.setState({messages: array})

        await this.props.solidCommunicator.acceptFriendSchipRequest(message);
    }

    componentDidMount(){
        this.props.solidCommunicator.getInboxContents().then(res => {
            this.setState({messages : res})
        })
    }

    render(){
        let items = this.state.messages.map((message, index)=> {
            let buttonDiv;
            
            if(message.type === "FriendshipRequest"){
                buttonDiv = (<div className = "buttonDiv">
                    <button onClick = {() => this.declineFriendShipRequest(index,message)}>Decline</button>
                    <button onClick = {() => this.acceptFriendShipRequest(index, message)}>Accept</button>
                </div>)
            }

            return (<li key = {message.url}>
                <h4>{message.type}</h4>
                <p>from : {message.from}</p>
                <p>{message.description}</p>
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
