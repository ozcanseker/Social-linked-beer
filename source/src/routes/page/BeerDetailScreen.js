import React from 'react';
import '../css/BeerDetailScreen.scss';
import BeerCheckInOverlay from '../../component/BeerCheckInOverlay';
import {Link} from "react-router-dom";
import Brewer from "../../model/HolderComponents/Brewer";

class BeerDetailScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            overlay: false,
            beerReview: "",
            beerRating: 2.5,
            addReview: false,
            selectedOptions: []
        };

        this.props.solidCommunicator.fetchBeerData(this.props.modelHolder.getBeer()).then(res => {
        });
        this.props.modelHolder.setBrewer(new Brewer(this.props.modelHolder.getBeer().getBrewerUrl()));
    }

    onPostBeerReview = async () => {
        await this.props.solidCommunicator.postBeerReview(this.state.addReview,
            this.props.modelHolder.getBeer(),
            this.state.beerRating,
            this.state.beerReview,
            this.state.selectedOptions.map(res => {
                return res.value
            })
        );

        this.setState({
            overlay: false,
            beerReview: "",
            beerRating: 2.5,
            addReview: false,
            selectedOptions: [{value: this.props.modelHolder.getUser().getCheckInLocation(), label: "Public"}]
        })
    };

    onCheckInClick = () => {
        this.setState({
            overlay: true
        });
    };

    onOverLayCancelClick = () => {
        this.setState({
            overlay: false
        });
    };

    setBeerRating = (rating) => {
        this.setState({
            beerRating: rating
        });
    };

    onBeerReviewChange = (text) => {
        this.setState({
            beerReview: text
        });
    };

    onAddReviewClick = () => {
        this.setState({
            addReview: !this.state.addReview,
            beerRating: 2.5,
            beerReview: ""
        })
    };

    onSelectGroup = (e) => {
        this.setState({
            selectedOptions: e
        })
    };

    render() {
        let beer = this.props.modelHolder.getBeer();
        let beerData;

        //get Groups
        let groups = this.props.modelHolder.getGroups().map(res => {
            return {value: res.getCheckInLocation(), label: res.getName()}
        });
        groups.unshift({value: this.props.modelHolder.getUser().getCheckInLocation(), label: "Public"});

        let description;
        let alcholdPercentage;
        let min;
        let max;
        let stamworth;
        let style;

        if (beer._description) {
            description = (<div className={"textBeerDetailScreen"}>
                    <p><b>Description</b></p>
                    {beer._description}
                </div>
            )
        }

        if (beer._alcoholpercentage) {
            alcholdPercentage = (<div className={"textBeerDetailScreen"}>
                    <p><b>Alcoholpercentage</b></p>
                    {beer._alcoholpercentage}%
                </div>
            )
        }

        if (beer._stamwortgehalte) {
            stamworth = (<div className={"textBeerDetailScreen"}>
                    <p><b>Gravity</b></p>
                    {beer._stamwortgehalte}%
                </div>
            )
        }

        if (beer._minSchenkTemperatuur) {
            min = (<div className={"textBeerDetailScreen"}>
                    <p><b>Min serving temperature</b></p>
                    {beer._minSchenkTemperatuur}&deg;C
                </div>
            )
        }

        if (beer._maxSchenkTemperatuur) {
            max = (<div className={"textBeerDetailScreen"}>
                    <p><b>Max serving temperature</b></p>
                    {beer._maxSchenkTemperatuur}&deg;C
                </div>
            )
        }

        if (beer._style) {
            style = (<div className={"textBeerDetailScreen"}>
                    <p><b>Style</b></p>
                    {beer._style}
                </div>
            )
        }

        beerData = (<React.Fragment>
            {description}
            {style}
            {alcholdPercentage}
            {stamworth}
            {min}
            {max}
        </React.Fragment>);

        return (
            <section className="beerDetailScreen">
                <h1>
                    {beer._name}
                </h1>
                <div id="addReviewButtonDiv">
                    <p>
                        <Link to={"/brewer/0"}>
                            Brewer page
                        </Link>
                    </p>
                    <button onClick={this.onCheckInClick}>Check in beer</button>
                </div>

                {beerData}


                <BeerCheckInOverlay
                    overlay={this.state.overlay}
                    beerReview={this.state.beerReview}
                    beerRating={this.state.beerRating}
                    onOverLayCancelClick={this.onOverLayCancelClick}
                    setBeerRating={this.setBeerRating}
                    onBeerReviewChange={this.onBeerReviewChange}
                    onAddReviewClick={this.onAddReviewClick}
                    addReview={this.state.addReview}
                    checkInBeer={this.onPostBeerReview}
                    groupsOptions={groups}
                    onSelect={this.onSelectGroup}
                    selectedOptions={this.state.selectedOptions}
                />
            </section>
        )
    }
}

export default BeerDetailScreen;
