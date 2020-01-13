import React from 'react';
import '../css/Profile.scss';
import profilePic from '../../assets/profilePic.png';
import BeerCheckInComponent from "../../component/BeerCheckInComponent";
import Logo from "../../assets/logowhite.png";

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
        let isFlipped = this.state.isFlipped;

        userCheckIns = userCheckIns.map(checkIn => {
            return (
                <BeerCheckInComponent key={checkIn._fileLocation} checkin={checkIn}/>
            )
        });

        if (user.getStartDate()) {
            content = (<div className="profileCard">
                <div className={"card " + (isFlipped ? "is-flipped" : "")}
                     onClick={() => {
                         this.setState({isFlipped: !this.state.isFlipped})
                     }}>
                    <div className="card__face card__face--front">
                        <h1>
                            {user.getName()}
                        </h1>
                        {/*TODO make image load faster*/}
                        <img src={imgUrl ? imgUrl : profilePic} alt=""/>
                        <div className={"profileUserAppContent"}>
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
                        </div>
                    </div>
                    <div className="card__face card__face--back">
                        <img src={Logo}/>
                        <p>This person is an offical member of the Social linked beer club</p>
                    </div>
                </div>
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