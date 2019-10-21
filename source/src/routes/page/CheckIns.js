import React from 'react';
import '../css/CheckIns.scss'

class Friends extends React.Component{
    constructor(props) {
        super(props);

        this.getAllCheckIns();
    }

    getAllCheckIns = () => {
        //this.props.solidCommunicator.getAllCheckIns(url);
    }

    render(){
        return(
            <section id = "beerCheckIns">
                <h1>
                    Check-Ins
                </h1>
            </section>
        )
    }
}

export default Friends;
