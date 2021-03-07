import {React, Component} from 'react'
import './style.css'
import {ProgressBar} from 'react-bootstrap'

class Sale extends Component{
    render(){
        return <div className="d-flex row justify-content-center">

            
            <div  className="sale">
                <h4><img style={{width:40}} src={window.location.origin + '/images/haw.png'}></img> Hawk Token</h4>
            <div style={{marginTop:4, marginBottom: 10}}>
                <div className='d-flex justify-content-center'>
                    <p><font style={{color: 'rgb(0, 110, 255)'}}>43.35</font> / <font style={{fontSize: 12.6}}>100 BNB</font> </p>
                </div>
                <ProgressBar striped animated label={'60% complete'} className="probar" now={40} /> 
            </div>
            <p style={{fontSize:17}}><i className="fas fa-flag-checkered"></i> Price: 0.001 <font style={{color: 'rgb(253, 238, 21)'}}>BNB</font>/HAW</p>
            <p style={{fontSize:13}}><i className="fas fa-exchange-alt"></i> Max buy amount: 5 <font style={{color: 'rgb(253, 238, 21)'}}>BNB</font></p>
            <p style={{fontSize:13}}><i className="fas fa-layer-group"></i> Your Tokens Buyed: 500 <font style={{color: 'rgb(0, 110, 255)'}}>HAWK</font></p>
            <p style={{marginTop:10}}><i className="fas fa-wallet"></i> Send Address:</p>
            <p style={{fontSize: 15, overflow: "hidden",textOverflow: 'ellipsis',}}>0x10144474f5B4c85FF6DA4f5eBdCa404642Fc36DA</p>
            <button className="btn copy">Spend BNB</button>
            </div>

            <div  className="sale col-6">
                <h4><i className="fas fa-exchange-alt"></i> Transactions</h4>
                <ul className="list-group">
                    <li className="list-group-item"> 1.50 BNB <img style={{width:20}} src={window.location.origin + '/images/bnb.png'}></img> spent <i className="fas fa-chevron-down"></i> Details</li>
                    <li className="list-group-item"> 0.20 BNB <img style={{width:20}} src={window.location.origin + '/images/bnb.png'}></img> spent <i className="fas fa-chevron-down"></i> Details</li>
                    <li className="list-group-item"> 3.22 BNB <img style={{width:20}} src={window.location.origin + '/images/bnb.png'}></img> spent <i className="fas fa-chevron-down"></i> Details</li>
                    <li className="list-group-item"> 4.00 BNB <img style={{width:20}} src={window.location.origin + '/images/bnb.png'}></img> spent <i className="fas fa-chevron-down"></i> Details</li>
                        
                </ul>

           
            
            </div>
        </div>
    }
}

export default Sale;