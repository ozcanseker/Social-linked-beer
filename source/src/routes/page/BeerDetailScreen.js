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
            addReview: false,
            selectedOptions : [{value: this.props.modelHolder.getUser().getCheckInLocation(), label : "Public"}]
        };

        this.props.modelHolder.setBrewer(new Brewer(this.state.beer.getBrewer()));
    }

    componentDidMount() {
        this.props.solidCommunicator.fetchBeer(this.props.modelHolder.getBeer()).then(res => {});
    }

    onPostBeerReview = async () => {
        await this.props.solidCommunicator.postBeerReview(this.state.addReview,
            this.state.beer,
            this.state.beerRating,
            this.state.beerReview,
            this.state.selectedOptions.map(res => {return res.value})
        );

        this.setState({
            overlay: false,
            beerReview : "",
            beerRating : 2.5,
            addReview: false,
            selectedOptions : [{value: this.props.modelHolder.getUser().getCheckInLocation(), label : "Public"}]
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
    };

    onSelectGroup = (e) => {
        this.setState({
            selectedOptions : e
        })
    };

    render() {
        let beer = this.state.beer;
        let brewerName = beer._brewer.replace("https://", "").replace(/\..*/, "");

        let groups = this.props.modelHolder.getGroups().map(res => {
            return {value: res.getCheckInLocation(), label : res.getName()}
        });

        groups.push({value: this.props.modelHolder.getUser().getCheckInLocation(), label : "Public"});

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
                 groupsOptions = {groups}
                 onSelect = {this.onSelectGroup}
                 selectedOptions = {this.state.selectedOptions}
                />
                
            </section>
        )
    }
}

export default BeerDetailScreen;
