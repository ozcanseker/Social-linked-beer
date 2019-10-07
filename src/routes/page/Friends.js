import React from 'react';
import {Link} from "react-router-dom";
import Friend from "../../model/Friend"
import '../css/Friends.scss'

class Friends extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            inputText : "https://ozcanseker.inrupt.net/profile/card#me",
            error : undefined
        }
    }

    onChange = (e) => {
        this.setState({
            inputText: e.target.value
        })        
    }

    onButtonClick = () => {
        if(this.props.user.getWebId() === this.state.inputText){
            this.props.history.push("/profile");
        }else{
            this.props.solidCommunicator.getUserFile(this.state.inputText, (res, error) => {

                if(error){
                    this.setState({   
                        error : error
                    })
                }else{
                    this.props.history.push({
                        pathname:"/user",
                        state:{
                            result: res
                        }
                    });
                }
            })
        }
    }

    render(){
        let friends = this.props.user.getFriends();
        
        let friendsElements = friends.map((friend, index) => {
            return <li>
                <Link key = {friend.uri} to= {`/friend/${index}`}>
                    <p>
                        name : {friend.name}
                    </p>
                </Link>
            </li> 
        });

        return(
            <div className = "friends">
                <h1>
                    Friends
                </h1>
                <br/>

                <div className = "searchFriends">
                    <input type = "text" placeholder ="profilecard link" value = {this.state.inputText} onChange = {this.onChange}></input>
                    <button onClick = {this.onButtonClick}>Search on the web</button>
                    <p style = {{color: "red"}}>{this.state.error}</p>
                </div>

                <ul className = "friendSection">
                    {friendsElements}
                </ul>

            </div>
        )
    }
}

export default Friends;
