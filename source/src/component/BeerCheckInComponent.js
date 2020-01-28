import React from "react";
import "./css/BeerCheckInComponent.scss"
import Like from "../assets/Thumb-emoji.png";
import StandardContext from "../context/StandardContext";

/**
 * This is the component that show the beer checkin or review. You can see this component on your profile screen under
 * recent activities.
 */
class BeerCheckInComponent extends React.Component {
    //This is the method that gets called when the check in is liked
    onLikeClick = () => {
        let solidCommunicator = this.context.solidCommunicator;

        if (solidCommunicator) {
            solidCommunicator.onLikeClick(this.props.checkin);
        }
    };

    render() {
        let checkIn = this.props.checkin;
        let rating;
        let review;
        let time;

        if (checkIn._rating) {
            rating = <p>rating: {checkIn._rating}</p>
        } else {
            rating = <br/>;
        }

        if (checkIn._review) {
            review = <p>review: <br/> {checkIn._review}</p>
        } else {
            review = <br/>;
        }

        if (checkIn._checkInTime) {
            time = (<p>{dateToString(new Date(checkIn._checkInTime))}</p>)
        } else {
            time = <br/>;
        }

        let className = checkIn.getLiked() ? "" : "greyScaled";

        return (
            <li className="BeerCheckInComponent">
                <div className={"BeerCheckInComponentMainSection"}>
                    <p>
                        {checkIn._userName ? checkIn._userName : checkIn._userWebId} is drinking a {checkIn._beerName}
                    </p>
                    <div className={"beerCheckInComponentTextDiv"}>
                        {time}
                        {rating}
                    </div>

                </div>
                <div className={"BeerCheckInComponentLikeReviewSection"}>
                    {review}
                    <div className={"beerCheckInComponentButtonDiv"}>
                        <span>{checkIn.getAmountOfLiked()}</span>
                        <img className={className} src={Like} alt="like button" onClick={this.onLikeClick}/>
                    </div>
                </div>
            </li>)
    }
}

BeerCheckInComponent.contextType = StandardContext;

function dateToString(date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();

    return dd + '/' + mm + '/' + yyyy;
}

export default BeerCheckInComponent;