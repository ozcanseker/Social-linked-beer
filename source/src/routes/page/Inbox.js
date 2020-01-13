import React from 'react';
import "../css/Inbox.scss";
import {FRIENDSHIPREQUESTCLASSNAME, GROUPINVITATIONCLASSNAME} from "../../solid/rdf/Constants";
import FetchingComponent from "../../component/FetchingComponent";

class Inbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: false
        }
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
        this.setState({fetching: true});

        this.props.solidCommunicator.getInboxContents().then(() => {
            this.setState({fetching: false})
        });
    }

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
                <ul>
                    {items}
                </ul>
                {fetching}
            </section>
        )
    }
}

export default Inbox;
