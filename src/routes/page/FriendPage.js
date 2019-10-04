import React from 'react';


class FriendPage extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let friend = this.props.user.getFriendFromIndex(this.props.match.params.id);

        return (
            <h1>
                {friend.name}
            </h1>
        );
    }
}

export default FriendPage;