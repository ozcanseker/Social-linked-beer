import React from 'react';
import {Link} from "react-router-dom";
import '../css/Friends.scss'
import {
    updateToErrorToast,
    updateToSuccesToast,
    waitToast
} from "../../component/ToastMethods";
import profilePic from '../../assets/profilePic.png';

/**
 * Shows a list of all friends
 */
class Friends extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputText: "",
            error: undefined
        };
    }

    onChange = (e) => {
        this.setState({
            inputText: e.target.value
        })
    };

    checkIfUser = () => {
        let text = this.state.inputText.toUpperCase();
        let friend = this.props.modelHolder.getUser();

        //regular uro
        let friendUri = friend.getUri().toUpperCase();

        //uri without the hash
        let friendUri2 = friend.getUri().toUpperCase().replace("#ME", "").replace("#I", "");

        //uri without https
        let friendUri3 = friendUri.replace("HTTPS://", "");
        let friendUri4 = friendUri2.replace("HTTPS://", "");

        //check if text mathes any of these thing
        return friendUri === text || friendUri2 === text || friendUri3 === text || friendUri4 === text;
    };

    onButtonClick = async () => {
        let friends = this.props.modelHolder.getFriends();

        friends = friends.filter(friend => {
            let text = this.state.inputText.toUpperCase();
            //regular uro
            let friendUri = friend.getUri().toUpperCase();

            //uri without the hash
            let friendUri2 = friend.getUri().toUpperCase().replace("#ME", "").replace("#I", "");

            //uri without https
            let friendUri3 = friendUri.replace("HTTPS://", "");
            let friendUri4 = friendUri2.replace("HTTPS://", "");

            //check if text mathes any of these thing
            return friendUri === text || friendUri2 === text || friendUri3 === text || friendUri4 === text;
        });

        if (friends.length !== 0) {
            //this is a mess and lazy programming but keep it in because i do not have time to change it.
            let index = this.props.modelHolder.getFriends().map((profile, index) => {
                if (friends[0].getUri() === profile.getUri()) {
                    return index;
                } else {
                    return undefined;
                }
            }).filter(index => {
                return index
            });

            this.props.history.push(`/friend/${index[0]}`);
        } else if (this.checkIfUser()) {
            this.props.history.push("/profile");
        } else {
            let toast = waitToast("Retrieving user file");

            try {
                let result = await this.props.solidCommunicator.getUserFile(this.state.inputText);

                this.props.history.push({
                    pathname: "/user",
                    state: {
                        result: result
                    }
                });

                updateToSuccesToast(toast, "User retrieved");
            } catch (e) {
                this.setState({error: e.message});
                updateToErrorToast(toast, "Something went wrong");
            }
        }
    };

    onKeyPress = (e) => {
        if (e.key === "Enter") {
            this.onButtonClick();
        }
    }

    render() {
        let friends = this.props.modelHolder.getFriends();
        let text = this.state.inputText.toUpperCase();

        let friendsElements = friends.map((friend, index) => {
            if (friend.getUri().toUpperCase().includes(text) || (friend.getName() && friend.getName().toUpperCase().includes(text))) {
                let imgUrl = friend.getImageUrl();
                let friendsName = friend.getName() ? (<h3>{friend.getName()}</h3>) : (<h3>&nbsp;</h3>);

                return <li key={friend.getUri()} className={"friendSectionProfileCard"}>
                    <Link to={`/friend/${index}`}>
                        {friendsName}
                        <img src={imgUrl ? imgUrl : profilePic} alt=""/>
                    </Link>
                </li>
            } else {
                return undefined;
            }
        });


        return (
            <section className="friends">
                <div className="searchFriends">
                    <h3>
                        Make new friends
                    </h3>
                    <br/>
                    <p className={"friendsError"}>{this.state.error}</p>
                    <input type="text" placeholder="https://profile.card/profile/card#me" value={this.state.inputText}
                           onChange={this.onChange} onKeyPress={this.onKeyPress}/>
                    <button onClick={this.onButtonClick}>Search on the web</button>
                </div>

                <div className="friendSection">
                    <h1>
                        Your friends
                    </h1>
                    <ul>
                        {friendsElements}
                    </ul>
                </div>
            </section>
        )
    }
}

export default Friends;
