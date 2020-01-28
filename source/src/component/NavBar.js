import React from 'react';
import './css/NavBar.scss'

/**
 * This is the navbar on the top. The white one wich allows you to go to different pages.
 */
class NavBar extends React.Component {
    render() {
        //If there is only one child it wony give you back an array
        let cldn = React.Children.toArray(this.props.children);
        let input;

        //for every child make a component.
        cldn = cldn.map((child, index) => {
            return (
                <li key={child.props.to}>
                    {child}
                </li>
            )
        });

        //If logged in show the check in beer button in the navbar
        if (this.props.loggedIn) {
            input = (<li key={"input"}>
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
