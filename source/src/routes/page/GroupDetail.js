import React from 'react';
import "../css/GroupDetail.scss";
import BeerCheckInComponent from "../../component/BeerCheckInComponent";
import {Icon} from "semantic-ui-react";

class GroupDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            group: this.props.modelHolder.getGroupFromIndex(this.props.match.params.id)
        }
    }

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
        })

        groupMembers = groupMembers.map(res => {
            let name;

            if (this.state.group.getLeader()) {
                name = (<p>{res === this.state.group.getLeader() ? <b>leader: </b> : undefined}
                    {res.member + " [" + res.points + "]"}
                </p>);
            }

            return (<li key={res}>
                    {name}
                </li>
            )
        });

        return (
            <section className="groupDetailScreen">
                <h1>{this.state.group.getName()}</h1>
                <div className="groupDetailSection">
                    <div className="participants">
                        <Icon name="star"/>
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
                </div>
            </section>
        )
    }
}

export default GroupDetail;