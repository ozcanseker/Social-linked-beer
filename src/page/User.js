import React from 'react';

class User extends React.Component{

    render(){
        console.log(this.props);
        let result = this.props.location.state.result

        return(
            <section className = "home">
                <h3>
                    {result.name}
                    <button>Send friendship request</button>
                </h3>
            </section>
        )
    }
}

export default User;
