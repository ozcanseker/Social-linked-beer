import React from 'react';
import './css/BeerCheckInScreen.scss';

import Rating from '@material-ui/lab/Rating';
import Select from "react-select";

/**
 * This is the overlay that opens when you want to check in a beer.
 */
class BeerCheckInOverlay extends React.Component {
    constructor(props) {
        super(props);
    }

    onDivClick = (e) => {
        e.stopPropagation();
    };
    
    render() {
        let rating;
        let text;

        //these are the components that open when you click the add review button
        if (this.props.addReview) {
            rating = (<Rating
                name="beerRating"
                value={this.props.beerRating}
                precision={0.5}
                onChange={(event, newValue) => {
                    this.props.setBeerRating(newValue);
                }}
                />
            );

            text = (
                <textarea
                    value={this.props.beerReview}
                    placeholder={"Write a review here"}
                    onChange={event => {
                        this.props.onBeerReviewChange(event.target.value)
                    }
                    }/>

            );

            rating = (
                <div className={"reviewSectionBeerCheckIn"}>
                    {rating}<br/>
                    {text}
                </div>
            );
        }

        return (
            <div onClick={this.props.onOverLayCancelClick} id="overlay" style={this.props.overlay ? { display: "block" } : { display: "none" }}>
                <div id="text" onClick={this.onDivClick}>
                    <h1>
                        Check in beer
                    </h1>
                    <button className={"addReviewButton"} onClick = {this.props.onAddReviewClick}>{this.props.addReview ? "dont add review": "Add review"}</button>
                    {rating}
                    <h5>Post location: </h5>
                    <Select
                        className = {"SelectGroupMakerOverlay"}
                        isMulti = {true}
                        onChange = {this.props.onSelect}
                        options = {this.props.groupsOptions}
                        value = {this.props.selectedOptions}
                    />

                    <button onClick = {this.props.checkInBeer}>check in beer</button>
                </div>
            </div>
        )
    }
}

export default BeerCheckInOverlay;