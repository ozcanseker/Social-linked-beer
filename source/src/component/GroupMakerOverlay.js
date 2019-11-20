import React from 'react';
import Select from "react-select";
import "./css/GroupMakerOverlay.scss"

class GroupMakerOverlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    onDivClick = (e) => {
        e.stopPropagation();
    }

    render() {
        return (
            <div onClick={this.props.onOverLayCancelClick} id="overlayGroup" style={this.props.overlay ? { display: "block" } : { display: "none" }}>
                <div id="textGroup" onClick={this.onDivClick}>
                    <h5>
                        makeGroup
                    </h5>
                    <span>group name</span> : <input value={this.props.groupName} onChange={this.props.onChange}/>
                    <button onClick={this.props.makeGroup}>make new group</button>
                    <Select
                        isMulti = {true}
                        options={this.props.valuesSelector}
                        value = {this.props.selectedFriends}
                        onChange = {this.props.onSelect}
                    />
                </div>
            </div>
        )
    }
}

export default GroupMakerOverlay;