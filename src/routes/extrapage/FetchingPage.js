import React from 'react';
import '../css/FetchingPage.scss';

class FetchingPage extends React.Component {
    render() {
        return (
            <section className= "rendering">
                <h1>Fetching data</h1>
                <div id="fetchinAnimation"></div>
            </section>
        )
    }
}

export default FetchingPage;