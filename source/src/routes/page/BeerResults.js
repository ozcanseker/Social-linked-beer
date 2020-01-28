import React from 'react';
import '../css/BeerResults.scss';
import {Link} from "react-router-dom";

/**
 * Shows the results of the search request.
 */
class BeerResults extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: ""
        }
    }

    // this gets called when you click on the search button
    onButtonClick = () => {
        if (this.props.searchQuery !== "") {
            this.props.solidCommunicator.fetchBeerList(this.state.searchQuery).then(res => {
            });
        } else {
            this.props.modelHolder.setBeers([]);
        }
    };

    //this gets called when you click on a beer link
    onLinkClick = (e) => {
        this.props.modelHolder.setBeer(e);

        this.setState({searchQuery : ""});
        this.props.modelHolder.setBeers([]);
    };

    //this gets called when you type something in the search bar
    onBeerSearch = (text) => {
        this.setState({
            searchQuery: text
        });
    };

    //this gets called when you press enter in the search field.
    onKeyPress = (e) => {
        if (e.key === "Enter") {
            this.onButtonClick();
        }
    };

    render() {
        //renders all the beers.
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

