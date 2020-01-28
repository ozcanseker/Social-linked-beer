import React from 'react';
import '../css/Profile.scss'
import profilePic from '../../assets/profilePic.png'
import BeerCheckInComponent from "../../component/BeerCheckInComponent";
import {Link} from "react-router-dom";
import Logo from '../../assets/logowhite.png'

/**
 * This is screen that shows the profile screen of the logged in user.
 */
class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isFlipped: false
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
                         this.setState({isFlipped: !this.state.isFlipped})
                     }}>
                    <div className="card__face card__face--front">
                        <div className={"upperSectionProfileCard"}>
                            <h1>
                                {user.getName()}
                            </h1>
                            <img src={imgUrl ? imgUrl : profilePic} alt=""/>
                        </div>
                        <div className={"profileUserAppContent"}>
                            <table className={"profileTable"}>
                                <tbody>
                                <tr>
                                    <td>
                                        Check-ins
                                    </td>
                                    <td>
                                        &nbsp;:&nbsp;
                                    </td>
                                    <td>
                                        {checkInHandler.getCheckInsAmount()}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Reviews
                                    </td>
                                    <td>
                                        &nbsp;:&nbsp;
                                    </td>
                                    <td>
                                        {checkInHandler.getBeerReviewsAmount()}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Begin date
                                    </td>
                                    <td>
                                        &nbsp;:&nbsp;
                                    </td>
                                    <td>
                                        {dateToString(user.getBeginDate())}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Beerpoints
                                    </td>
                                    <td>
                                        &nbsp;:&nbsp;
                                    </td>
                                    <td>
                                        {checkInHandler.getBeerPoints()}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="card__face card__face--back">
                        <img src={Logo} alt={"Social linked beer stamp"}/>
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
                        <h1>
                            Recent activities
                        </h1>
                    </div>
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