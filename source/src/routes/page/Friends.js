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
    };

    checkIfUser = () => {
        let text = this.state.inputText.toUpperCase();
        let friend = this.props.modelHolder.getUser();

        //regular uro
        let friendUri = friend.getUri().toUpperCase();

        //uri without the hash
        let friendUri2 = friend.getUri().toUpperCase().replace("#ME", "").replace("#I", "");

        //uri without https
        let friendUri3 = friendUri.replace("HTTPS://", "");
        let friendUri4 = friendUri2.replace("HTTPS://", "");

        //check if text mathes any of these thing
        return  friendUri === text || friendUri2 === text || friendUri3 === text || friendUri4 === text;
    }

    onButtonClick = async () => {
        let friends = this.props.modelHolder.getFriends();

        friends = friends.filter(friend => {
            let text = this.state.inputText.toUpperCase();
            //regular uro
            let friendUri = friend.getUri().toUpperCase();

            //uri without the hash
            let friendUri2 = friend.getUri().toUpperCase().replace("#ME", "").replace("#I", "");

            //uri without https
            let friendUri3 = friendUri.replace("HTTPS://", "");
            let friendUri4 = friendUri2.replace("HTTPS://", "");

            //check if text mathes any of these thing
            return  friendUri === text || friendUri2 === text || friendUri3 === text || friendUri4 === text;
        });

        if (friends.length !== 0){
            //this is a mess and lazy programming but keep it in because i do not have time to change it.
            let index = this.props.modelHolder.getFriends().map((profile, index) => {
                if(friends[0].getUri() === profile.getUri()){
                    return index;
                }else{
                    return undefined;
                }
            }).filter(index => {return index});

            this.props.history.push(`/friend/${index[0]}`);
        } else if(this.checkIfUser()){
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
    };

    render(){
        let friends = this.props.modelHolder.getFriends();
        let text = this.state.inputText.toUpperCase();

        let friendsElements = friends.map((friend, index) => {
            if(friend.getUri().toUpperCase().includes(text) || (friend.getName() && friend.getName().toUpperCase().includes(text))) {
                return <li key={friend.getUri()}>
                    <Link to={`/friend/${index}`}>
                        <p>
                            {friend.getName() ? friend.getName() : friend.getUri()}
                        </p>
                    </Link>
                </li>
            }else{
                return undefined;
            }
        });

        return(
            <section className = "friends">
                <div className = "searchFriends">
                    <h3>
                        Make new friends
                    </h3>
                    <br/>
                    <input type = "text" placeholder ="https://profile.card/profile/card#me" value = {this.state.inputText} onChange = {this.onChange}/>
                    <button onClick = {this.onButtonClick}>Search on the web</button>
                    <p style = {{color: "red"}}>{this.state.error}</p>
                </div>

                <div className = "friendSection">
                    <h1>
                        Friends
                    </h1>
                    <ul>
                        {friendsElements}
                    </ul>
                </div>
            </section>
        )
    }
}

export default Friends;
