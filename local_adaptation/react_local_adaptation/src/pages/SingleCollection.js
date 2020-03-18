import React from 'react';

import collectionsList from '../collectionsList';

function SingleCollection({match}, props){
    console.log(props)
    const collection = collectionsList.find(({id}) => id === match.params.collectionId)
    return(
        <div className="something">
            <h1>{collection.title}</h1>
            <collection.component></collection.component>
        </div>
    )
}

export default SingleCollection;