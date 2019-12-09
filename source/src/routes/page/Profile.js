import React from 'react';
import '../css/Profile.scss'
import profilePic from '../../assets/profilePic.png'
import BeerCheckInComponent from "../../component/BeerCheckInComponent";
import {Link} from "react-router-dom";

class Profile extends React.Component{
    render(){
        let user = this.props.modelHolder.getUser();
        let imgUrl = user.getImageUrl();
        let checkInHandler = this.props.modelHolder.getCheckInHandler();
        let userCheckIns = checkInHandler.getUserCheckIns();
        let content;

        userCheckIns = userCheckIns.map(checkIn => {
            return (
                <BeerCheckInComponent key = {checkIn._fileLocation} checkin = {checkIn}/>
            )
        });

        if(user.getBeginDate()){
            content = (<div className="leftColumnProfile">
                    <h1>
                        {user.getName()}
                    </h1>
                    {/*TODO make image load faster*/}
                    <img src = {imgUrl ? imgUrl : profilePic} alt = ""/>
                    <p>
                        check-ins : {checkInHandler.getCheckInsAmount()}
                    </p>
                    <p>
                        reviews : {checkInHandler.getBeerReviewsAmount()}
                    </p>
                    <p>
                        Begin date : {dateToString(user.getBeginDate())}
                    </p>
                    <p>
                        beerbonus points : {checkInHandler.getBeerPoints()}
                    </p>
                </div>
            )
        }
        
        return(
            <section className = "profileScreen">
                    {content}
                    <div className="checkedInBeersProfile">
                        <div className = "checkinDiv">
                            <Link to="/checkIns">All check ins &rarr;</Link>
                        </div>
                        <h1>
                            Recent activities
                        </h1>
                            <ul>
                                {userCheckIns}
                            </ul>
                    </div>
            </section>
        )
    }
}

function dateToString(date){
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();

    return dd + '/' + mm + '/' + yyyy;
}

export default Profile;