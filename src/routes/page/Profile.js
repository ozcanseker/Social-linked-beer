import React from 'react';
import '../css/Profile.scss'
import profilePic from '../../assets/profilePic.png'

class Profile extends React.Component{
    render(){
        let user = this.props.user;
        let imgUrl = user.getImageUrl();

        return(
            <section className = "profileScreen">
                
                <div className="row">
                    <div className="leftColum">
                        <h1>
                            {user.getName()}
                        </h1>
                            {/*TODO make image load faster*/}
                            <img src = {imgUrl ? imgUrl : profilePic} alt = ""/>
                        <p>
                            check-ins : {0}
                        </p>
                        <p>
                            reviews : 0
                        </p>
                        <p>
                            Begin date : {dateToString(user.getBeginDate())}
                        </p>
                        <p>
                            beerbonus points : {user.getBeerPoints()}
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

function dateToString(date){
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();

    return dd + '/' + mm + '/' + yyyy;
}

export default Profile;