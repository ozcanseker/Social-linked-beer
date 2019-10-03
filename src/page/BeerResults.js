import React from 'react';
import '../css/BeerResults.scss'
import {Link} from "react-router-dom";

class BeerResults extends React.Component{
    constructor(props){
        super(props);

        this.list = [
            {name: "Hertog jan"},
            {name: "Hertog jan"},
            {name: "Hertog jan"},
            {name: "Hertog jan"},
            {name: "Hertog jan"},
            {name: "Hertog jan"},
            {name: "Hertog jan"},
            {name: "Hertog jan"},
            {name: "Hertog jan"},
            {name: "Hertog jan"},
        ]
    }


    render(){
        let elements = this.list.map(listItem => {
                return (
                    <li>
                        <Link to = "/beer/hertogJan" onClick = {this.props.onLinkClick}>
                            {listItem.name}
                        </Link>
                    </li>
                )
        })

        return(
            <div>
                <h1>Beer Results</h1>
                <ul>
                    {elements}
                </ul>
            </div>
        )
    }
}

export default BeerResults;

