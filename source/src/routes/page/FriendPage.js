import React from 'react';
import '../css/Profile.scss'
import profilePic from '../../assets/profilePic.png'
import {Link} from "react-router-dom";
import BeerCheckInComponent from "../../component/BeerCheckInComponent";

class FriendPage extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            user : this.props.user.getFriendFromIndex(this.props.match.params.id)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.state.user.unsubscribe(this);
        this.state.user.subscribe(this);
    }

    render(){
        let user = this.state.user;
        let imgUrl = user.getImageUrl();
        let userCheckIns = user.getUserCheckIns()

        userCheckIns = userCheckIns.map(checkIn => {
            return (
                <BeerCheckInComponent key = {checkIn._fileLocation} checkin = {checkIn}/>
            )
        })

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
                            check-ins : {user.getCheckIns()}
                        </p>
                        <p>
                            reviews : {user.getBeerReviews()}
                        </p>
                        <p>
                        Begin date : {dateToString(user.getStartDate())}
                        </p>
                        <p>
                            beerbonus points : {user.getPoints()}
                        </p>
                    </div>
                    <div className="column">

                        <h1>
                            Recent activities
                        </h1>
                        <ul>
                            {userCheckIns}
                        </ul>
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

export default FriendPage;