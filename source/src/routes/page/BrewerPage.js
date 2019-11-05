import React from "react";
import "../css/BrewerPage.scss"
import {Link} from "react-router-dom";

class BrewerPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            brewer: this.props.modelHolder.getBrewer()
        }

        this.getBrewer();
    }

    getBrewer = () => {
        this.props.solidCommunicator.getBrewerInformation(this.state.brewer).then(res => {
        })
    }

    render() {
        let section;
        let brewer = this.state.brewer;
        let beers;

        if (brewer.getGroep()) {
            section = (
                <div>
                    <h1>
                        {this.state.brewer._name}
                    </h1>
                    <p>{brewer._groep}</p>
                    <p>{brewer._opgericht}</p>
                    <p>{brewer._owners.join(", ")}</p>
                    <p>{brewer._provincie}</p>
                    <p>{brewer._email}</p>
                    <p>{brewer._taxid}</p>
                    <p>{brewer._telephone}</p>
                    <p>{brewer._url}</p>
                    <p>{brewer._postalcode}</p>
                    <p>{brewer._streetAdress}</p>
                    <p>{brewer._addressRegion}</p>
                    <p>{brewer._addressLocality}</p>
                </div>
            )

            if (brewer._beers) {
                beers = brewer._beers.map(listItem => {
                    return ( <li key = {listItem._location}>
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
            }
        }

        return (
            <section className="brewerPage">
                {section}

                <br/>
                <br/>

                <h3>Beers</h3>
                <ul>
                    {beers}
                </ul>
            </section>
        )
    }
}

export default BrewerPage;