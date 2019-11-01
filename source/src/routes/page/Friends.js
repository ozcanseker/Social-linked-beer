import React from 'react';
import {Link} from "react-router-dom";
import '../css/Friends.scss'

class Friends extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            inputText : "",
            error : undefined
        }
    }

    onChange = (e) => {
        this.setState({
            inputText: e.target.value
        })        
    }

    onButtonClick = async () => {
        let friends = this.props.user.getFriends();
        friends = friends.filter(friend => {
            let text = this.state.inputText.toUpperCase();
            let friendUri = friend.getUri().toUpperCase();
            let friendUri2 = friend.getUri().toUpperCase().replace("#ME", "").replace("#I", "");
            let friendUri3 = friendUri.replace("HTTPS://", "");
            let friendUri4 = friendUri2.replace("HTTPS://", "");
            
            return  friendUri === text || friendUri2 === text || friendUri3 === text || friendUri4 === text;
        });

        if (friends.length !== 0){
            let index = this.props.user.getFriends().map((profile, index) => {
                if(friends[0].getUri() === profile.getUri()){
                    return index;
                }
            }).filter(index => {return index})

            this.props.history.push(`/friend/${index[0]}`);
        } else if(this.props.user.getWebId() === this.state.inputText){
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
        let friends = this.props.modelHolder.getFriends();
        friends = friends.filter(friend => {
            let text = this.state.inputText.toUpperCase();
            if(friend.getName()){
                return friend.getName().toUpperCase().includes(text) || friend.getUri().toUpperCase().includes(text);
            }

            return friend.getUri().toUpperCase().includes(text);
        });
        
        let friendsElements = friends.map((friend, index) => {
            return <li key = {friend.getUri()}>
                <Link  to= {`/friend/${index}`}>
                    <p>
                        {friend.getName() ? friend.getName() : friend.getUri()}
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
