import  Home  from './pages/Home';
import About from './pages/About';
import Resources from './pages/Resources';
import Collections from './pages/Collections';

import LocalAdaptation from './pages/collections/LocalAdaptation';

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
},{
    path: '/collections/:id',
    subpath: 'localadaptation',
    component: LocalAdaptation,
    refresh: true
}
]

export default routes;