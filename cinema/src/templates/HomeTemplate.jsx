import React from 'react'
import HeaderComponent from '../components/Header/HeaderComponent'
import FooterComponent from '../components/Footer/FooterComponent'
import { Route } from 'react-router-dom'

export const Home = (props) => {
    return (
        <>
            <HeaderComponent/>
            { props.children }
            <FooterComponent/>   
        </>
    )
}


export const HomeTemplate = ({Component, ...rest}) => {
    return <Route {...rest} render={(props) => {
        return <Home>
            <Component {...props}/>
        </Home> 
    }}/>
}