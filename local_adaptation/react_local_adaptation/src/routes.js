import  Home  from './pages/Home';
import About from './pages/About';
import Resources from './pages/Resources';
import Collections from './pages/Collections';

import LocalAdaptation from './pages/collections/LocalAdaptation';
import SamplePage from './pages/collections/SamplePage'

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
    path: '/collections',
    subpath: 'localadaptation',
    component: LocalAdaptation,
    refresh: true,
    displayName: 'Local Adaptation'
},{
    path: '/collections',
    subpath: 'samplepage',
    component: SamplePage,
    refresh: true,
    displayName: 'Sample Page'
}
]

export default routes;