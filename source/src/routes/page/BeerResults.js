import React from 'react';
import '../css/BeerResults.scss';
import {Link, Redirect} from "react-router-dom";
import Brewer from "../../model/HolderComponents/Brewer";

class BeerResults extends React.Component {
    constructor(props) {
        super(props);
    }

    // componentDidMount() {
    //     if(this.props.searchQuery !== ""){
    //         this.props.solidCommunicator.fetchBeerList(this.props.searchQuery).then(res => {});
    //     }else{
    //         this.props.modelHolder.setBeers([]);
    //     }
    // }

    onButtonClick= () => {
        if(this.props.searchQuery !== ""){
            this.props.solidCommunicator.fetchBeerList(this.props.searchQuery).then(res => {});
        }else{
            this.props.modelHolder.setBeers([]);
        }
    };

    onLinkClick = (e) => {
        this.props.modelHolder.setBeer(e);
        this.props.onLinkClick();
    };

    render() {
        let elements = this.props.modelHolder.getBeers().map((listItem , index) => {
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
                    <input value={this.props.searchQuery} onChange={(e) => {
                        this.props.onBeerSearch(e.target.value);
                    }}/>
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

