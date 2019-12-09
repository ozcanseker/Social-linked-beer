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

        if (this.props.loggedIn) {
            input = (<li key={"input"} id="navBarSearch">
                <input type="button" value="Check in beer" onClick={this.props.onSearchBarButtonClick}/>
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
