import React from 'react';
import '../css/CheckIns.scss'
import BeerCheckInComponent from "../../component/BeerCheckInComponent";

/**
 * Shows all the checkins of the user
 */
class Friends extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            res : []
        };

        this.getAllCheckIns();
    }

    //gets all checking of the logged in user.
    getAllCheckIns = () => {
        this.props.solidCommunicator.getAllCheckInsLoggedInUser();
    };


    render(){
        let userCheckIns = this.props.modelHolder.getCheckInHandler().getUserCheckIns();

        userCheckIns = userCheckIns.map(checkIn => {
            return (
                <BeerCheckInComponent key = {checkIn._fileLocation} checkin = {checkIn}/>
            )
        });

        return(
            <section id = "beerCheckIns">
                <h1>
                    Check-Ins
                </h1>
                <ul>
                    {userCheckIns}
                </ul>
            </section>
        )
    }
}

export default Friends;
