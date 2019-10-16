import React from 'react';
import '../css/NavBar.scss'

class NavBar extends React.Component{
    onInput = (e) => {
        this.props.onBeerSearch(e.target.value);
    }

    render(){
        let cldn =React.Children.toArray( this.props.children);
        let input;

        cldn = cldn.map((child, index) => {            
            if(index !== cldn.length - 1){
                return (
                    <li key = {child.props.to} className = "navBarOptionContainer">
                        {child}
                    </li>
                )
            }else{
                return(
                    <li key = {child.props.to} className = "navBarOptionContainerLast">
                        {child}
                    </li>
                )
            }            
        });

        if(this.props.loggedIn){
            input = (<li className = "navBarSearch">
                <input  placeholder = "search for beers" value = {this.props.searchQuery} onChange = {this.onInput} />
                <input type = "button" value = "x" onClick = {this.props.onSearchBarButtonClick}/>
            </li>)
        }

        return(
            <nav>
                <ul id = "navBar">
                    {cldn}
                    {input}
                </ul>
            </nav>
        )
    }
}

export default NavBar;
