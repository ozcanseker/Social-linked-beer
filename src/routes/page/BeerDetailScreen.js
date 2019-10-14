import React from 'react';
import '../css/BeerDetailScreen.scss';

import Rating from '@material-ui/lab/Rating';

class BeerDetailScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            beer: this.props.location.state.beer,
            overlay : false
        }
    }

    componentDidMount() {
        this.props.solidCommunicator.fetchBeer(this.state.beer._location, this.state.beer).then(res => {
            this.setState({
                beer: res
            })
        });
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

    onDivClick = (e) => {
        e.stopPropagation();
    }

    render() {
        let beer = this.state.beer;

        console.log(this.state.beer);
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
                    <a href={beer._brewer}>brewer</a>
                </p>
                <p>
                    containers: {beer._containers}
                </p>

                <div onClick = {this.onOverLayCancelClick} id="overlay" style= {this.state.overlay ? {display : "block"} : {display : "none"}}>
                    <div id = "text" onClick = {this.onDivClick}>
                        <h5>
                            check in beer
                        </h5>
                        <button>check in beer</button>    
                        <Rating/>
                    </div>
                </div>
            </section>
        )
    }
}

export default BeerDetailScreen;
