import React from 'react';
import '../css/Profile.scss'
import profilePic from '../../assets/profilePic.png'
import BeerCheckInComponent from "../../component/BeerCheckInComponent";
import {Link} from "react-router-dom";
import Logo from '../../assets/logowhite.png'

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isFlipped : false
        }
    }

    render() {
        let user = this.props.modelHolder.getUser();
        let imgUrl = user.getImageUrl();
        let checkInHandler = this.props.modelHolder.getCheckInHandler();
        let userCheckIns = checkInHandler.getUserCheckIns();
        let content;

        let isFlipped = this.state.isFlipped;

        userCheckIns = userCheckIns.map(checkIn => {
            return (
                <BeerCheckInComponent key={checkIn._fileLocation} checkin={checkIn}/>
            )
        });

        if (user.getBeginDate()) {
            content = <div className="profileCard">
                <div className={"card " + (isFlipped ? "is-flipped" : "")}
                     onClick={() => {
                         this.setState({isFlipped : !this.state.isFlipped})}}>
                    <div className="card__face card__face--front">
                        <h1>
                            {user.getName()}
                        </h1>
                        <img src={imgUrl ? imgUrl : profilePic} alt=""/>
                        <div className={"profileUserAppContent"}>
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
                                beerpoints : {checkInHandler.getBeerPoints()}
                            </p>
                        </div>

                    </div>
                    <div className="card__face card__face--back">
                        <img src={Logo}/>
                        <p>This person is an offical member of the Social linked beer club</p>
                    </div>
                </div>
            </div>
        }

        return (
            <section className="profileScreen">
                {content}
                <div className="checkedInBeersProfile">
                    <div className="checkinDiv">
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

function dateToString(date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();

    return dd + '/' + mm + '/' + yyyy;
}

export default Profile;