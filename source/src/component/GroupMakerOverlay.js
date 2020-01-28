import React from 'react';
import Select from "react-select";
import "./css/GroupMakerOverlay.scss"

/**
 * This is the overlay that shows when you click on the make a group button
 * This is also used to add extra members to the group on the group detail screen.
 */
class GroupMakerOverlay extends React.Component {
    //this is here to stop the div from bubbling.
    onDivClick = (e) => {
        e.stopPropagation();
    };

    render() {
        let text = "Add more friends";
        let text2 = "Add friends";
        let nameField;

        //if it is a new group and not adding extra members to the group than add these things.
        if(this.props.isNewGroup){
            text = "Make new group";
            text2 = "Make group";
            nameField = (<div className={"nameFieldGroupMakerOverlay"}><span>Group name</span> &nbsp;:&nbsp; <input value={this.props.groupName} onChange={this.props.onChange}/></div>);
        }

        //This is an error message that you can display.
        let errorB = (this.props.error !== "") ? <p style={{color: "red"}}>{this.props.error}</p> : undefined;

        return (
            <div onClick={this.props.onOverLayCancelClick} id="overlayGroup" style={this.props.overlay ? { display: "block" } : { display: "none" }}>
                <div id="textGroup" onClick={this.onDivClick}>
                    <h1>
                        {text}
                    </h1>
                    {errorB}
                    {nameField}
                    <Select
                        className = {"SelectGroupMakerOverlay"}
                        isMulti = {true}
                        options={this.props.valuesSelector}
                        value = {this.props.selectedFriends}
                        onChange = {this.props.onSelect}
                    />

                    <button onClick={this.props.makeGroup}>{text2}</button>
                </div>
            </div>
        )
    }
}

export default GroupMakerOverlay;