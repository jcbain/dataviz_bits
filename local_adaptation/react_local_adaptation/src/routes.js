import  Home  from './pages/Home';
import About from './pages/About';
import Resources from './pages/Resources';
import Collections from './pages/Collections';
import SingleCollection from './pages/SingleCollection';

const routes = [{
    path: '/',
    component: Home,
    refresh: false
}, {
    path: '/about',
    component: About,
    refresh: false
}, {
    path: '/resources',
    component: Resources,
    refresh: false
}, {
    path: '/collections',
    component: Collections,
    refresh: false
},
{
    path: '/collections/:collectionId',
    component: SingleCollection,
    refresh: true
}

]

export default routes;