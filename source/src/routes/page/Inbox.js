import React from 'react';
import "../css/Inbox.scss";
import {FRIENDSHIPREQUESTCLASSNAME, GROUPINVITATIONCLASSNAME} from "../../solid/rdf/Constants";
import FetchingComponent from "../../component/FetchingComponent";

/**
 * This is the inbox page.
 */
class Inbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: false
        }
    }

    //This is the method that gets called when you decline a frienship request
    declineFriendShipRequest = (index, message) => {
        this.props.modelHolder.spliceAtIndex(index);
        this.props.solidCommunicator.declineFriendSchipRequest(message);
    };

    //This is the method that gets called when you accept a friendship request
    acceptFriendShipRequest = (index, message) => {
        this.props.modelHolder.spliceAtIndex(index);
        this.props.solidCommunicator.acceptFriendSchipRequest(message);
    };

    //this is the button that gets called when you decline a group request
    declineGroupRequest = (index, message) => {
        this.props.modelHolder.spliceAtIndex(index);
        this.props.solidCommunicator.declineGroupRequest(message);
    };

    //this is the button that gets called when you accept a group request
    acceptGroupRequest = (index, message) => {
        this.props.modelHolder.spliceAtIndex(index);
        this.props.solidCommunicator.acceptGroupRequest(message);
    };

    //on mount the application fetches all the inbox messages.
    componentDidMount() {
        this.setState({fetching: true});

        this.props.solidCommunicator.getInboxContents().then(() => {
            this.setState({fetching: false})
        });
    };

    render() {
        let items;
        let fetching;

        if (!this.state.fetching) {
            items = this.props.modelHolder.getInboxMessages().map((message, index) => {
                let buttonDiv;

                if (message.getType() === FRIENDSHIPREQUESTCLASSNAME) {
                    buttonDiv = (<div className="buttonDiv">
                        <button onClick={() => this.declineFriendShipRequest(index, message)}>Decline</button>
                        <button onClick={() => this.acceptFriendShipRequest(index, message)}>Accept</button>
                    </div>)
                } else if (message.getType() === GROUPINVITATIONCLASSNAME) {
                    buttonDiv = (<div className="buttonDiv">
                        <button onClick={() => this.declineGroupRequest(index, message)}>Decline</button>
                        <button onClick={() => this.acceptGroupRequest(index, message)}>Accept</button>
                    </div>)
                } else if (message.getType() !== undefined){
                    return undefined;
                }

                return (<li key={message.getUri()}>
                    <h4>{message.getType()}</h4>
                    <p>{message.getFrom() ? "from :" + message.getFrom() : "fetching file"}</p>
                    <p>{message.getDesc()}</p>
                    {buttonDiv}
                </li>)
            });
        }else{
            fetching = (<FetchingComponent message = {"Retrieving inbox messages"}/>);
        }

        return (
            <section className="inbox">
                <h1>
                    Inbox
                </h1>
                {fetching}
                <ul>
                    {items}
                </ul>

            </section>
        )
    }
}

export default Inbox;
