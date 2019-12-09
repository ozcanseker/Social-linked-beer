import React from 'react';
import '../css/Profile.scss';
import profilePic from '../../assets/profilePic.png';
import BeerCheckInComponent from "../../component/BeerCheckInComponent";

class FriendPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.modelHolder.getFriendFromIndex(this.props.match.params.id)
        }
    }

    render() {
        let user = this.state.user;
        let imgUrl = user.getImageUrl();
        let userCheckIns = user.getCheckInHandler().getUserCheckIns()
        let content;

        userCheckIns = userCheckIns.map(checkIn => {
            return (
                <BeerCheckInComponent key={checkIn._fileLocation} checkin={checkIn}/>
            )
        })

        if (user.getStartDate()) {
            content = (<div className="leftColumnProfile">
                <h1>
                    {user.getName()}
                </h1>
                {/*TODO make image load faster*/}
                <img src={imgUrl ? imgUrl : profilePic} alt=""/>
                <p>
                    check-ins : {user.getCheckInHandler().getCheckInsAmount()}
                </p>
                <p>
                    reviews : {user.getCheckInHandler().getBeerReviewsAmount()}
                </p>
                <p>
                    Begin date : {dateToString(user.getStartDate())}
                </p>
                <p>
                    beerbonus points : {user.getCheckInHandler().getBeerPoints()}
                </p>
            </div>);
        }

        return (
            <section className="profileScreen">
                {content}
                <div className="checkedInBeersProfile">
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

export default FriendPage;