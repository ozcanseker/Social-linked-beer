import React from 'react';
import './css/NavBar.scss'

class NavBar extends React.Component {
    onInput = (e) => {
        this.props.onBeerSearch(e.target.value);
    };

    render() {
        let cldn = React.Children.toArray(this.props.children);
        let input;

        cldn = cldn.map((child, index) => {
            return (
                <li key={child.props.to}>
                    {child}
                </li>
            )
        });

        console.log(this.props);

        if (this.props.loggedIn) {
            input = (<li id="navBarSearch">
                <input placeholder="search for beers" value={this.props.searchQuery} onChange={this.onInput}/>
                <input type="button" value="x" onClick={this.props.onSearchBarButtonClick}/>
            </li>);

            cldn.splice(cldn.length - 1, 0, input);
        }

        return (
            <nav>
                <ul id="navBarUL">
                    {cldn}
                </ul>
            </nav>
        )
    }
}

export default NavBar;
