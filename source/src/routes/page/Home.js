import React from 'react';
import '../css/Home.scss'
import solidImage from '../../assets/Knipsel.png';
import Logo from '../../assets/logowhite.png';
import PLDNlogo from '../../assets/pldnlogo.png'

class Home extends React.Component {
    render() {
        return (
            <section className="home">
                <div className={"homeSection homesection-right socialLinkedBeerSection"}>
                    <img src={Logo}/>
                    <div className={"text-section"}>
                        <h1>Social Linked Beer</h1>
                        <p>Social Linked Beer is an application to share your beer adventures with your friends. This
                            application is made for PLDN.
                            It is made with Solid.</p>
                    </div>
                </div>
                <div className={"homeSection solidSection"}>
                    <div className={"text-section"}>
                        <h1>Solid</h1>
                        <p>Solid was created by the inventor of the World Wide Web, Sir Tim Berners-Lee. Its mission is
                            to reshape the web as we know it. Solid will foster a new breed of applications with
                            capabilities above and beyond anything that exists today.</p>
                    </div>
                    <img src={solidImage}/>
                </div>
                <div className={"homeSection homesection-right pldnSection"}>
                    <img src={PLDNlogo}/>
                    <div className={"text-section"}>
                        <h1>PLDN</h1>
                        <p>
                            Linked Data Netherlands platform is a network where experts and interested parties share
                            knowledge about linked data.</p>
                    </div>
                </div>
            </section>
        )
    }
}

export default Home;
