import React from 'react';
import './css/FetchingComponent.scss';

class FetchingComponent extends React.Component {
    render() {
        return (
            <section className= "rendering">
                <h1>{this.props.message ? this.props.message : "Fetching data"}</h1>
                <div id="fetchingAnimation"/>
            </section>
        )
    }
}

export default FetchingComponent;