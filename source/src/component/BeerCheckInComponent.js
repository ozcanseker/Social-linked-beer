import React from "react";
import "../css/BeerCheckInComponent.scss"

class BeerCheckInComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let checkIn = this.props.checkin;
        let rating;
        let review;

        if(checkIn._rating){
            rating = <p>rating: {checkIn._rating}</p>
        }

        if(checkIn._review){
            review = <p>review: {checkIn._review}</p>
        }

        return (
            <li className= "BeerCheckInComponent">
                <h5>
                    {checkIn._userName ? checkIn._userName : checkIn._userWebId} is drinking a {checkIn._beerName}
                </h5>
                {rating}
                {review}
            </li>)
    }
}

export default BeerCheckInComponent;