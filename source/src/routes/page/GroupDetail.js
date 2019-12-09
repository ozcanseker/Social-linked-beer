import React from 'react';
import "../css/GroupDetail.scss";
import BeerCheckInComponent from "../../component/BeerCheckInComponent";
import Star from '../../assets/star.png';
import GroupMakerOverlay from "../../component/GroupMakerOverlay";
import StandardContext from "../../context/StandardContext";

class GroupDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            group: this.props.modelHolder.getGroupFromIndex(this.props.match.params.id),
            overlay: false,
            selectedFriends: []
        };
    }

    addFriendsClick = () => {
        this.setState({
            overlay: true
        });
    };

    onOverLayCancelClick = () => {
        this.setState({
            overlay: false
        });
    };

    onSelectFriend = (e) => {
        this.setState({
            selectedFriends: e
        })
    };

    addFriends = (e) => {
        let solidCommunicator = this.context.solidCommunicator;

        let beerDrinkerFolder = this.props.modelHolder.getUser().getBeerDrinkerFolder();
        let friends = this.state.selectedFriends.map(res => {
            return res.value;
        });

        if (solidCommunicator) {
            solidCommunicator.addFriendsToGroup(this.state.group, friends);
        }

        this.setState({
            overlay: false,
            selectedFriends: []
        });
    };

    render() {
        let userCheckIns = this.state.group.getCheckInHandler().getUserCheckIns();
        userCheckIns = userCheckIns.map(checkIn => {
            return (
                <BeerCheckInComponent key={checkIn._fileLocation} checkin={checkIn}/>
            )
        });

        let groupMembers = this.state.group.getMembers();
        groupMembers.push(this.state.group.getLeader());
        groupMembers.sort((a, b) => {
            return b.points - a.points;
        });

        let addFriendsButton;
        let friendsComs;

        if (this.state.group._createdByMe) {
            addFriendsButton = (<div className={"addMembersButtonDiv"}>
                <button className={"addMembersButton"} onClick={this.addFriendsClick}>Add members</button>
            </div>);

             friendsComs = this.props.modelHolder.getFriends().filter(res => {
                for (let i = 0; i < groupMembers.length; i++) {
                    if (groupMembers[i] && res.getUri() === groupMembers[i].member) {
                        return false;
                    }
                }
                return true;
            }).map(res => {
                return {value: res, label: res.getName()}
            });
        }

        groupMembers = groupMembers.map(res => {
            let name;

            if (this.state.group.getLeader()) {
                name = (<p>{res === this.state.group.getLeader() ?
                    <img alt="leader" src={Star} title="leader"/> : undefined}
                    {res.member + " [" + res.points + "]"}
                </p>);
            }

            return (<li key={JSON.stringify(res)}>
                    {name}
                </li>
            )
        });

        return (
            <section className="groupDetailScreen">
                <h1>{this.state.group.getName()}</h1>
                <div className="groupDetailSection">
                    <div className="participants">
                        {addFriendsButton}
                        <h2>
                            Users
                        </h2>
                        <ul>
                            {groupMembers}
                        </ul>
                    </div>
                    <div className="checkInsGroup">
                        <h2>
                            Checkins
                        </h2>
                        <ul>
                            {userCheckIns}
                        </ul>
                    </div>
                    <GroupMakerOverlay
                        overlay={this.state.overlay}
                        onOverLayCancelClick={this.onOverLayCancelClick}
                        valuesSelector={friendsComs}
                        selectedFriends={this.state.selectedFriends}
                        onSelect={this.onSelectFriend}
                        makeGroup={this.addFriends}
                    />
                </div>
            </section>
        )
    }
}

GroupDetail.contextType = StandardContext;

export default GroupDetail;