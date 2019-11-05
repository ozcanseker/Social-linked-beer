import React from 'react';
import '../css/BeerResults.scss';
import {Link, Redirect} from "react-router-dom";

class BeerResults extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.solidCommunicator.fetchBeerData().then(res => {
            if (res) {
                this.props.modelHolder.setBeers(res);
            }
        });
    }

    onLinkClick = (e) => {
        this.props.modelHolder.setBeer(e);

        this.props.onLinkClick();
    }

    render() {

        let elements = this.props.modelHolder.getBeers().map(listItem => {
            return (
                <li key={listItem._location}>
                    <Link to={`/beer/${listItem._name}`}
                          onClick={() => {
                              this.onLinkClick(listItem)
                          }}>
                        {listItem._name}
                    </Link>
                </li>
            )
        });

        return (
            <section className="beerResults">
                <h1>Beer Results</h1>
                <ul>
                    {elements}
                </ul>
            </section>
        )
    }
}

export default BeerResults;

