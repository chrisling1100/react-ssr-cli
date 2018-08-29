import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {isServer} from '../store/createStore'
import Header from '../components/header/header'
import Router from '../route/index'

import {setRouteChecked} from '../store/auth'


class App extends Component {

    componentWillMount() {
        if (!isServer) {
            console.info(arguments)
        }
    }

    render() {
        return (
            <div id='app'>
                <Header {...this.props}/>
                <div id='content'>
                    <Router/>
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => ({checkedRoute: state.auth.checkedRoute})
const mapDispatchToProps = dispatch => bindActionCreators({setRouteChecked}, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
