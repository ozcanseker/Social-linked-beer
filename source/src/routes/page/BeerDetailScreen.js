import React from 'react';
import '../css/BeerDetailScreen.scss';
import BeerCheckInOverlay from '../../component/BeerCheckInOverlay';
import {Link, Redirect} from "react-router-dom";
import Brewer from "../../model/HolderComponents/Brewer";

class BeerDetailScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            beer: this.props.modelHolder.getBeer(),
            overlay : false,
            beerReview : "",
            beerRating : 2.5,
            addReview: false
        }

        console.log(this.state.beer);
        this.props.modelHolder.setBrewer(new Brewer(this.state.beer.getBrewer()));
    }

    componentDidMount() {
        this.props.solidCommunicator.fetchBeer(this.props.modelHolder.getBeer()).then(res => {});
    }

    onPostBeerReview = async () => {
        await this.props.solidCommunicator.postBeerReview(this.state.addReview, this.state.beer, this.state.beerRating, this.state.beerReview);

        this.setState({
            overlay: false,
            beerReview : "",
            beerRating : 2.5,
            addReview: false
        })
    }

    onCheckInClick= () => {
        this.setState({
            overlay : true
        });
    }

    onOverLayCancelClick= () => {
        this.setState({
            overlay : false
        });
    }

    setBeerRating = (rating) => {
        this.setState({
            beerRating : rating
        });
    }

    onBeerReviewChange = (text) => {
        this.setState({
            beerReview : text
        });
    }
    
    onAddReviewClick = () => {
        this.setState({
            addReview: !this.state.addReview,
            beerRating: 2.5,
            beerReview: ""
        })
    }

    render() {
        let beer = this.state.beer;
        let brewerName = beer._brewer.replace("https://", "").replace(/\..*/, "");

        return (
            <section className="beerDetailScreen">
                <h1>
                    {beer._name}
                </h1>
                <p>
                    {beer._description}
                </p>
                <div>
                    <button onClick= {this.onCheckInClick}>Check in beer</button>
                </div>
                <p>
                    <Link to={`/brewer/${brewerName}`}>
                        brewer
                    </Link>
                </p>
                <p>
                    containers: {beer._containers}
                </p>

                <BeerCheckInOverlay
                 overlay = {this.state.overlay}
                 beerReview = {this.state.beerReview}
                 beerRating = {this.state.beerRating}
                 onOverLayCancelClick = {this.onOverLayCancelClick}
                 setBeerRating = {this.setBeerRating}
                 onBeerReviewChange = {this.onBeerReviewChange}
                 onAddReviewClick = {this.onAddReviewClick}
                 addReview = {this.state.addReview}
                 checkInBeer = {this.onPostBeerReview}
                />
                
            </section>
        )
    }
}

export default BeerDetailScreen;
