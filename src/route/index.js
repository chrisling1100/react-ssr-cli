import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Loadable from 'react-loadable'

const About = Loadable({
    loader: () => import('../containers/about/about'),
    loading: () => null,
    modules: ['about']
})

const Home = Loadable({
    loader: () => import('../containers/home/home'),
    loading: () => null,
    modules: ['home']
})

const DashBoard = Loadable({
    loader: () => import('../containers/dashboard/dashboard'),
    loading: () => null,
    modules: ['dashboard']
})

export default () => (
    <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/about' component={About}/>
        <Route exact path='/dashboard' component={DashBoard}/>
    </Switch>
)
