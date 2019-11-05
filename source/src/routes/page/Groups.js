import React from 'react';
import "../css/Groups.scss";
import GroupMakerOverlay from "../../component/GroupMakerOverlay";

class Groups extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            overlay : false,
            groupName : "b",
            selectedFriends : []
        }
    }

    onMakeGroupClick= () => {
        this.setState({
            overlay : true
        });
    }

    onOverLayCancelClick= () => {
        this.setState({
            overlay : false
        });
    }

    makeGroup = () => {
        if(this.state.groupName !== ""){
            let beerDrinkerFolder = this.props.modelHolder.getUser().getBeerDrinkerFolder();
            let friends = this.state.selectedFriends.map(res => {
                return res.value;
            })

            this.props.solidCommunicator.makeNewGroup(beerDrinkerFolder, this.state.groupName, friends).then(res => {
                this.setState({
                    overlay : false,
                    selectedFriends : [],
                    groupName : ""
                });
            });
            console.log("make group");
        }
    }

    onSelectFriend = (e) => {
        this.setState({
            selectedFriends : e
        })
    }

    onGroupNameChange = (e) => {
        let text  = e.target.value;
        this.setState({
            groupName : text
        })
    }

    render(){
        let friendsComs = this.props.modelHolder.getFriends().map(res => {
            return {value: res.getUri(), label : res.getName()}
        })

        let groups = this.props.modelHolder.getGroups().map(res => {
            return (<li>
                    <a href= "https://google.com">{res.getName()}</a>
                </li>
            )
        });

        return(
            <section id = "groupsPage">
                <h1>
                    Groups
                </h1>
                <button className= "makeNewGroup" onClick={this.onMakeGroupClick}>makeNewGroup</button>
                <GroupMakerOverlay
                    overlay = {this.state.overlay}
                    onOverLayCancelClick = {this.onOverLayCancelClick}
                    onAddReviewClick = {this.onAddReviewClick}
                    addReview = {this.state.addReview}
                    checkInBeer = {this.onPostBeerReview}
                    onChange = {this.onGroupNameChange}
                    groupName = {this.state.groupName}
                    valuesSelector = {friendsComs}
                    selectedFriends = {this.state.selectedFriends}
                    onSelect = {this.onSelectFriend}
                    makeGroup = {this.makeGroup}
                />

                <ul>
                    {groups}
                </ul>
            </section>
        )
    }
}

export default Groups;
