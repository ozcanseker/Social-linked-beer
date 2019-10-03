import React from 'react';
import Knipsel from '../assets/Knipsel.png'
import '../css/Home.scss'

class Home extends React.Component{

    render(){
        return(
            <section className = "home">
                <h3>
                    This is an application that is powered by Solid.<br/> 
                    Log in with your pod to use the application
                </h3>
                <img src= {Knipsel} alt = "Inrupt logo"/>
            </section>
        )
    }
}

export default Home;
