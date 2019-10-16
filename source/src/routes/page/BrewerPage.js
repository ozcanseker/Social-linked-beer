import React from "react";
import "../css/BrewerPage.scss"

class BrewerPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            brewer: undefined,
            brewerId: this.props.location.state.brewer
        }

        this.mounted = false;

        this.getBrewer();
    }

    componentDidMount() {
        this.mounted = true;

        if (this.brewer) {
            this.setState({
                brewer: this.brewer
            })
        }
    }

    getBrewer = () => {
        this.props.solidCommunicator.getBrewerInformation(this.state.brewerId).then(res => {
            if (this.mounted) {
                this.setState({
                    brewer: res
                })
            } else {
                this.brewer = res;
            }
        })
    }


    render() {
        let section;
        let brewer = this.state.brewer;

        if (this.state.brewer) {
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
        }

        return (
            <section className="brewerPage">
                {section}
            </section>
        )
    }
}

export default BrewerPage;