import React from 'react';
import '../css/Profile.scss'
import profilePic from '../assets/profilePic.png'

class Profile extends React.Component{
    render(){
        let user = this.props.user;

        return(
            <section className = "profileScreen">
                
                <div className="row">
                    <div className="leftColum">
                        <h1>
                            {user.name}
                        </h1>
                        <img src = {user.imageUrl ? user.imageUrl : profilePic} alt = ""/>
                        <p>
                            check-ins : {user.beerPoints}
                        </p>
                        <p>
                            reviews : 2
                        </p>
                        <p>
                            Begin date : {user.startDate.toString()}
                        </p>
                        <p>
                            beerbonus points : 15
                        </p>
                    </div>
                    <div className="column">
                        <h1>
                            Recent activities
                        </h1>
                    </div>
                </div>
            </section>
        )
    }
}

export default Profile;