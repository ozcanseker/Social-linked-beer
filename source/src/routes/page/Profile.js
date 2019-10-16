import React from 'react';
import '../css/Profile.scss'
import profilePic from '../../assets/profilePic.png'
import BeerCheckInComponent from "../../component/BeerCheckInComponent";
import { Link, withRouter } from "react-router-dom";
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Fade from 'react-reveal/Fade';

class Profile extends React.Component{
    render(){
        let user = this.props.user;
        let imgUrl = user.getImageUrl();
        let userCheckIns = user.getUserCheckIns()

        userCheckIns = userCheckIns.map(checkIn => {
            return (
                <Fade key = {checkIn._fileLocation}>
                    <BeerCheckInComponent  checkin = {checkIn}/>
                </Fade>
            )
        })

        return(
            <section className = "profileScreen">
                
                <div className="row">
                    <div className="leftColum">
                        <h1>
                            {user.getName()}
                        </h1>
                            {/*TODO make image load faster*/}
                            <img src = {imgUrl ? imgUrl : profilePic} alt = ""/>
                        <p>
                            check-ins : {user.getCheckIns()}
                        </p>
                        <p>
                            reviews : {user.getBeerReviews()}
                        </p>
                        <p>
                            Begin date : {dateToString(user.getBeginDate())}
                        </p>
                        <p>
                            beerbonus points : {user.getBeerPoints()}
                        </p>
                    </div>
                    <div className="column">
                        <div className = "checkinDiv">
                            <Link to="/checkIns">All check ins &rarr;</Link>
                        </div>
                        <h1>
                            Recent activities
                        </h1>
                        <TransitionGroup>
                            <ul>
                                {userCheckIns}
                            </ul>
                        </TransitionGroup>
                    </div>
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