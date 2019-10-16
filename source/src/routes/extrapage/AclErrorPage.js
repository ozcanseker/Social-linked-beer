import React from 'react';
import '../css/AclErrorPage.scss';

class AclErrorPage extends React.Component{
    render(){
        //TODO geef detailed instuctie om het op te lossen.

        return (<section className = "aclErrorPage">
            <h1>
             The application does not have correct access. please give the application read, write, append and control access. 
            </h1>
        </section>)
    }
}

export default AclErrorPage;