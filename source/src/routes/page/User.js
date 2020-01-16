import React from 'react';
import '../css/User.scss'
import profilePic from '../../assets/profilePic.png';
import {waitToast, updateToSuccesToast, updateToErrorToast} from "../../component/ToastMethods";

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
            result: this.props.location.state.result
        }
    }

    onNotJoinedButtonClick = async () => {
        let result = this.state.result;

        let toast = waitToast("Sending invitation");

        this.setState(
            {
                clicked: true
            });

        await this.props.solidCommunicator.inviteUserToSolib(result.url, result.inbox);

        updateToSuccesToast(toast, "Invitation sent")
    };

    sendFriendShipRequest = async () => {
        //TODO check if friendship request is already set
        let result = this.state.result;

        this.setState(
            {
                clicked: true
            }
        );

        let toast = waitToast("Sending friend request");

        try {
            await this.props.solidCommunicator.sendFriendshipRequest(result.url, result.appLocation);
            updateToSuccesToast(toast, "Friend request sent")
        } catch (e) {
            updateToErrorToast(toast, "Already sent a friendship request")
        }

    };

    render() {
        let result = this.props.location.state.result;
        let button;

        if (!this.state.clicked) {
            if (result.appLocation) {
                button = (<button onClick={this.sendFriendShipRequest}>Send friendship request</button>);
            } else {
                button = (<button onClick={this.onNotJoinedButtonClick}>Invite to Social linked beer</button>);
            }
        } else {
            button = (<button disabled={true}>Request send</button>)
        }

        return (
            <section className="userPageNew">
                <div className="userPageHead">
                    <h1>
                        {result.name}
                    </h1>
                    <img src={result.imageUrl ? result.imageUrl : profilePic} alt=""/>
                    <div className="userButtonDiv">
                        {button}
                    </div>
                    <table className="userInfo">
                        <tbody>
                        <tr>
                            <td>Profile card URI</td>
                            <td>&nbsp;:&nbsp;</td>
                            <td>{result.url}</td>
                        </tr>
                        <tr>
                            <td>Has social linked beer account?</td>
                            <td>&nbsp;:&nbsp;</td>
                            <td>{result.appLocation ? "Yes" : "No"}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        )
    }
}

export default User;
