import React from 'react';
import "../css/Groups.scss";
import GroupMakerOverlay from "../../component/GroupMakerOverlay";
import {Link} from "react-router-dom";
import {updateToSuccesToast, waitToast} from "../../component/ToastMethods";

/**
 * This is the page where you see all your groups
 */
class Groups extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            overlay: false,
            groupName: "",
            selectedFriends: [],
            error: ""
        }
    }

    //This gets called when you click on make  a group
    onMakeGroupClick = () => {
        this.setState({
            overlay: true
        });
    };

    //this happens when you click on the black part when there is an overlay
    onOverLayCancelClick = () => {
        this.setState({
            overlay: false
        });
    };

    //this gets called when you select a friend in the select friend component
    onSelectFriend = (e) => {
        this.setState({
            selectedFriends: e
        })
    };

    /**
     * This gets called when you click on the make a group method
     */
    makeGroup = () => {
        if (this.state.groupName !== "" && !(/\s/.test(this.state.groupName))) {
            let toast = waitToast("Making group " + this.state.groupName);

            let beerDrinkerFolder = this.props.modelHolder.getUser().getBeerDrinkerFolder();
            let friends = this.state.selectedFriends.map(res => {
                return res.value;
            });

            let name = this.state.groupName;

            this.props.solidCommunicator.makeNewGroup(beerDrinkerFolder, this.state.groupName, friends).then(res => {
                updateToSuccesToast(toast, "Group " + name + " made");
            });

            this.setState({
                overlay: false,
                selectedFriends: [],
                groupName: ""
            });
        }else{
            this.setState({
                error : "Group name can not have spaces"
            })
        }
    };

    //gets called when you write in the group name field
    onGroupNameChange = (e) => {
        let text = e.target.value;
        this.setState({
            groupName: text
        })
    };

    render() {
        let friendsComs = this.props.modelHolder.getFriends().map(res => {
            return {value: res, label: res.getName()}
        });

        let groups = this.props.modelHolder.getGroups().map((res, index) => {
            return (
                <li key={res.getUrl() + res.getLeader()}>
                    <Link to={`/groups/${index}`}>{res.getName()}</Link>
                </li>
            )
        });

        return (
            <section id="groupsPage">
                <h1>
                    Groups
                </h1>
                <div className="makeNewGroupDiv">
                    <button className="makeNewGroup" onClick={this.onMakeGroupClick}>makeNewGroup</button>
                </div>
                <GroupMakerOverlay
                    overlay={this.state.overlay}
                    onOverLayCancelClick={this.onOverLayCancelClick}
                    onChange={this.onGroupNameChange}
                    groupName={this.state.groupName}
                    valuesSelector={friendsComs}
                    selectedFriends={this.state.selectedFriends}
                    onSelect={this.onSelectFriend}
                    makeGroup={this.makeGroup}
                    isNewGroup = {true}
                    error = {this.state.error}
                />

                <ul>
                    {groups}
                </ul>
            </section>
        )
    }
}

export default Groups;
