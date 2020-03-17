import React from 'react';
import { Link } from 'react-router-dom';

import routes from '../routes';



function Collections(props){
    console.log(props)

    const collectionCards = routes.map(({path, subpath, displayName}) => path === '/collections' && subpath ? <div className="card collection-item"><Link to={`${props.match.url}/${subpath}`}><h2>{displayName}</h2></Link></div> : null)

    return(
        <div>
            <h1>Collections</h1>
            {collectionCards}
            {/* <Link to={`${props.match.url}/localadaptation`}>Local </Link>
            <Link to={`${props.match.url}/samplepage`}>Sample </Link> */}
        </div>
    )
}

export default Collections;