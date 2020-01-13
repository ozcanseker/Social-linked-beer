import React from "react";
import "../css/BrewerPage.scss"
import {Link} from "react-router-dom";

class BrewerPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.props.solidCommunicator.getBrewerInformation(this.props.modelHolder.getBrewer());
    }

    onLinkClick = (e) => {
        this.props.modelHolder.setBeer(e);
    };

    render() {
        let brewer = this.props.modelHolder.getBrewer();

        let name;
        let adress;
        let groep;
        let url;

        let beers;

        if (brewer._name) {
            name = (
                <h1>
                    {brewer._name}
                </h1>
            );
        }

        if(brewer._groep){
            groep = (<div className={"brewerPageTextSectionDiv"}>
                    <p><b>
                        Group
                    </b></p>
                    <p>
                        {brewer._groep}
                    </p>
                </div>
            );
        }

        if (brewer.getAddress() !== "") {
            url = (
                <div className={"brewerPageTextSectionDiv"}>
                    <p><b>
                        Website
                    </b></p>
                    <a href={brewer._url}>
                        {brewer._url}
                    </a>
                </div>
            );
        }

        if (brewer._url) {
            adress = (
                <div className={"brewerPageTextSectionDiv"}>
                    <p><b>
                        Address
                    </b></p>
                    <p>
                        {brewer.getAddress()}
                    </p>
                </div>
            );
        }

        beers = brewer._beers.map((listItem, index) => {
            return (<li key={listItem.getUrl()}>
                    <Link to={`/beer/${index}`} onClick={() => {
                        this.onLinkClick(listItem)
                    }}>
                        {listItem.getName()}
                    </Link>
                </li>
            )
        })

        return (
            <section className="brewerPage">
                {name}
                {groep}
                {url}
                {adress}

                <h3>Beers</h3>
                <ul>
                    {beers}
                </ul>
            </section>
        )
    }
}

export default BrewerPage;