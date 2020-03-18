import React from 'react';
import { Link } from 'react-router-dom';

import collectionsList from './collections/collectionsList';



function Collections({match},props){
    console.log(props)

    const collectionCards = collectionsList.map(({id, title}) => (
        <div className="collection-card" key={id}>
            <Link to={`${match.url}/${id}`}>{title}</Link>
        </div>
    ))

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