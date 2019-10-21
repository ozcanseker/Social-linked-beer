import React from 'react';
import '../css/BeerCheckInScreen.scss';

import Rating from '@material-ui/lab/Rating';

class BeerCheckInOverlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    onDivClick = (e) => {
        e.stopPropagation();
    }
    
    render() {
        let rating;
        let text;

        if (this.props.addReview) {
            rating = (<Rating
                name="beerRating"
                value={this.props.beerRating}
                precision={0.5}
                onChange={(event, newValue) => {
                    this.props.setBeerRating(newValue);
                }}
                />
            )

            text = (
                <textarea
                    value={this.props.beerReview}
                    onChange={event => {
                        this.props.onBeerReviewChange(event.target.value)
                    }
                    }/>

            )
        }

        return (
            <div onClick={this.props.onOverLayCancelClick} id="overlay" style={this.props.overlay ? { display: "block" } : { display: "none" }}>
                <div id="text" onClick={this.onDivClick}>
                    <h5>
                        check in beer
                    </h5>
                    <button onClick = {this.props.onAddReviewClick}>{this.props.addReview ? "dont add review": "Add review"}</button>
                    {rating}
                    {text}
                    <br />
                    <button onClick = {this.props.checkInBeer}>check in beer</button>
                </div>
            </div>
        )
    }
}

export default BeerCheckInOverlay;