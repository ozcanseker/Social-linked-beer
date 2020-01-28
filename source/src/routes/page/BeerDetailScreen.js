import React from 'react';
import '../css/BeerDetailScreen.scss';
import BeerCheckInOverlay from '../../component/BeerCheckInOverlay';
import {Link} from "react-router-dom";
import {updateToSuccesToast, waitToast} from "../../component/ToastMethods";

/**
 * Shows the details of a beer
 */
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
    }

    /**
     * When an user wants to post a check in or review this method gets called.
     * @returns {Promise<void>}
     */
    onPostBeerReview = async () => {
        let addreview = this.state.addReview;
        let toast = waitToast("Posting beer " + (addreview ? "review" : "check in"));

        //post the beer review
        this.props.solidCommunicator.postBeerReview(this.state.addReview,
            this.props.modelHolder.getBeer(),
            this.state.beerRating,
            this.state.beerReview,
            this.state.selectedOptions.map(res => {
                return res.value
            })
        ).then(res => {
            updateToSuccesToast(toast, "Beer " + (addreview ? "review" : "check in") + " posted");
        });

        //change the state back
        this.setState({
            overlay: false,
            beerReview: "",
            beerRating: 2.5,
            addReview: false,
            selectedOptions: [{value: this.props.modelHolder.getUser().getCheckInLocation(), label: "Public"}]
        })
    };

    //this happens when you click on checkin, it will open the overlay
    onCheckInClick = () => {
        this.setState({
            overlay: true
        });
    };

    //this happens when you click next to the overlay
    onOverLayCancelClick = () => {
        this.setState({
            overlay: false
        });
    };

    //sets the rating of the beer
    setBeerRating = (rating) => {
        this.setState({
            beerRating: rating
        });
    };

    //keeps track of the review of the beer
    onBeerReviewChange = (text) => {
        this.setState({
            beerReview: text
        });
    };

    //this is the button that opens when you want to add a review instead of a checking
    onAddReviewClick = () => {
        this.setState({
            addReview: !this.state.addReview,
            beerRating: 2.5,
            beerReview: ""
        })
    };

    //gets called when you select the groups that you want to post the checkin in .
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

        let brewers = beer.getBrewers().map(res => {
            return (<Link key={res.getUrl()} to={"/brewer/0"} onClick={() => {
                this.props.modelHolder.setBrewer(res)
            }}>
                {res.getName()}
            </Link>)
        });


        return (
            <section className="beerDetailScreen">
                <div className={"beerDetailScreenDiv"}>
                    <h1>
                        {beer._name}
                    </h1>
                    <p className={"textBeerDetailScreen"}>
                        <b>Brewers</b>
                    </p>
                    {brewers}
                    <div id="addReviewButtonDiv">
                        <button onClick={this.onCheckInClick}>Check in beer</button>
                    </div>
                    {beerData}
                </div>
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
