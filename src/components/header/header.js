import React from 'react'
import {Link} from 'react-router-dom'
import './header.css'
const links = [
    {
        url: '/about',
        text: 'About'
    },
    {
        url: '/',
        text: 'Home'
    },
    {
        url: '/dashboard',
        text: 'Dashboard'
    },
]
export default ({setRouteChecked, location, checkedRoute}) => {
    return (
        <header>
            <h1>my first ssr app</h1>
            <ul>
                {
                    links.map((item) => (
                        <li key={item.text} className={checkedRoute === item.url ? 'active' :''} onClick={() => setRouteChecked(item.url)}>
                            <Link to={item.url}>
                                {
                                    item.text
                                }
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </header>
    )
}
