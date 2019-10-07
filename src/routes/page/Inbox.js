import React from 'react';
import "../css/Inbox.scss";

class Inbox extends React.Component{
    componentDidMount(){
        this.props.solidCommunicator.getInboxContents().then(res => {
            console.log(res);
        })
    }

    render(){
        return(
            <section className = "inbox">
                <h1>
                    Inbox
                </h1>
            </section>
        )
    }
}

export default Inbox;
