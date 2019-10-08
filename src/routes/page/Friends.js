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

    onButtonClick = async () => {
        if(this.props.user.getWebId() === this.state.inputText){
            this.props.history.push("/profile");
        }else{
            try{
                let result = await this.props.solidCommunicator.getUserFile(this.state.inputText);
                
                    this.props.history.push({
                        pathname:"/user",
                        state:{
                            result: result
                        }
                    });
            }catch(e){
                this.setState({error : e.message})
            }
        }
    }

    render(){
        let friends = this.props.user.getFriends();
        
        let friendsElements = friends.map((friend, index) => {
            return <li key = {friend.uri}>
                <Link  to= {`/friend/${index}`}>
                    <p>
                        {friend.getName()}
                    </p>
                </Link>
            </li> 
        });


        return(
            <section className = "friends">
                <div className = "searchFriends">
                    <h3>
                        Make new friends
                    </h3>
                    <br/>
                    <input type = "text" placeholder ="profilecard link" value = {this.state.inputText} onChange = {this.onChange}></input>
                    <button onClick = {this.onButtonClick}>Search on the web</button>
                    <p style = {{color: "red"}}>{this.state.error}</p>
                </div>

                <div className = "friendSection">
                    <h3>
                        Friends
                    </h3>
                    <ul >
                        {friendsElements}
                    </ul>
                </div>


            </section>
        )
    }
}

export default Friends;
