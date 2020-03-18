import React from 'react';

import collectionsList from './collections/collectionsList';

function SingleCollection({match}, props){
    const collection = collectionsList.find(({id}) => id === match.params.collectionId)
    return(
        <div className="collection-item">
            <h1>{collection.title}</h1>
            <collection.component />
        </div>
    )
}

export default SingleCollection;