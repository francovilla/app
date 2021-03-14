import React, { Component }  from 'react';
import {Navbar ,  } from 'react-bootstrap'
import './styles.css'
import blockies from '../../blockies/blockies';
import hold from '../../imgs/hold.png'

class NavS extends Component{

    render(){
        return <Navbar className="navbar-c" expand="lg" fixed="top">
        <Navbar.Brand  href="#"><h3 className="title">HAWK<i style={{color:'rgb(82,91,255)'}} className="fas fa-feather-alt"></i>finance</h3></Navbar.Brand>
        <Navbar.Text className="text-right" style={{
                color: 'white',
                verticalAlign: 'middle',
                fontSize: 15,
                backgroundColor: '#090d28',
                padding: 8,
                marginRight: 10,
                borderRadius: 10,
                maxWidth: '40%',
                overflow: "hidden",
                textOverflow: 'ellipsis',
            }}> {this.props.address}</Navbar.Text>
        </Navbar>
        
         
    }
}

export default NavS