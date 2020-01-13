import React from 'react';
import '../css/BeerResults.scss';
import {Link} from "react-router-dom";

class BeerResults extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: ""
        }
    }

    onButtonClick = () => {
        if (this.props.searchQuery !== "") {
            this.props.solidCommunicator.fetchBeerList(this.state.searchQuery).then(res => {
            });
        } else {
            this.props.modelHolder.setBeers([]);
        }
    };

    onLinkClick = (e) => {
        this.props.modelHolder.setBeer(e);
    };

    onBeerSearch = (text) => {
        this.setState({
            searchQuery: text
        });
    };

    onKeyPress = (e) => {
        if (e.key === "Enter") {
            this.onButtonClick();
        }
    }

    render() {
        let elements = this.props.modelHolder.getBeers().map((listItem, index) => {
            return (
                <li key={listItem.getUrl()}>
                    <Link to={`/beer/${index}`}
                          onClick={() => {
                              this.onLinkClick(listItem)
                          }}>
                        {listItem.getName()}
                    </Link>
                </li>
            )
        });

        return (
            <section className="beerResults">
                <h1>Beer Results</h1>
                <div className={"searchScreenSearch"}>
                    <input value={this.state.searchQuery}
                           placeholder={"Search for beers by name"}
                           size="23"
                           onChange={(e) => {
                               this.onBeerSearch(e.target.value);
                           }}
                           onKeyPress={this.onKeyPress}
                           autoFocus
                    />
                    <button onClick={this.onButtonClick}>search</button>
                </div>
                <ul>
                    {elements}
                </ul>
            </section>
        )
    }
}

export default BeerResults;

