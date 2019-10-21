import React from 'react';
import '../css/BeerDetailScreen.scss';
import BeerCheckInOverlay from '../../component/BeerCheckInOverlay';
import {Link, Redirect} from "react-router-dom";

class BeerDetailScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            beer: this.props.location.state.beer,
            overlay : false,
            beerReview : "",
            beerRating : 2.5,
            addReview: false
        }
    }

    componentDidMount() {
        this.props.solidCommunicator.fetchBeer(this.state.beer._location, this.state.beer).then(res => {
            this.setState({
                beer: res
            })
        });
    }

    onPostBeerReview = async () => {
        await this.props.solidCommunicator.postBeerReview(this.state.addReview, this.state.beer, this.state.addReview ? this.state.beerRating : undefined, this.state.beerReview);

        this.setState({
            overlay: false
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
            addReview: !this.state.addReview
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
                    <Link to={{
                        pathname: `/brewer/${brewerName}`,
                        state: {
                            brewer : beer._brewer
                        }
                    }}>
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
                 beerReview = {this.state.beerReview}
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
