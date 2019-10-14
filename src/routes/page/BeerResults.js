import React from 'react';
import '../css/BeerResults.scss';
import { Link } from "react-router-dom";

class BeerResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            beers: []
        }
    }

    componentDidMount() { 
        this.props.solidCommunicator.fetchBeerData().then(res => {
            if(res){
                this.setState({
                    beers : res
                })
            }
        });
    }

    render() {

        let elements = this.state.beers.map(listItem => {
            return (
                <li key = {listItem._location}>
                    <Link to={{
                        pathname: `/beer/${listItem._name}`,
                        state: {
                            beer : listItem
                        }
                    }} onClick={this.props.onLinkClick}>
                    {listItem._name}
                    </Link>
                </li>
            )
        })


        return (
            <section className = "beerResults">
                <h1>Beer Results</h1>
                <ul>
                    {elements}
                </ul>
            </section>
        )
    }
}

export default BeerResults;

