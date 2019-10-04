import React from 'react';
import Knipsel from '../../assets/Knipsel.png'
import '../css/Home.scss'

class Home extends React.Component{

    render(){
        return(
            <section className = "home">
                <h3>
                    This is an application that is powered by Solid.<br/> 
                    Log in with your pod to use the application
                </h3>
                <br/>
                <img src= {Knipsel} alt = "Inrupt logo"/>
                <br/>
                <h3 style = {{color : "red"}}>
                    Carefull, This application is still in development and might mess up your pod.
                    if you want to test it out, I recommend you make a new pod that you can delete
                </h3>
            </section>
        )
    }
}

export default Home;
