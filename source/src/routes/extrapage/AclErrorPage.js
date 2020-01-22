import React from 'react';
import '../css/AclErrorPage.scss';
import IMAGE1 from '../../assets/1.png';
import IMAGE2 from '../../assets/2.png';
import IMAGE3 from '../../assets/3.png';
import IMAGE4 from '../../assets/4.png';


class AclErrorPage extends React.Component{
    render(){
        //TODO geef detailed instuctie om het op te lossen.

        return (<section className = "aclErrorPage">
            <h1>
             The application does not have correct access. please give the application read, write, append and control access. 
            </h1>

            <h1>
                Go to your pod and follow the instructions below
            </h1>
            <img src={IMAGE1}/>
            <img src={IMAGE2}/>
            <img src={IMAGE3}/>
            <img src={IMAGE4}/>
        </section>)
    }
}

export default AclErrorPage;