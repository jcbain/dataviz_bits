import React from 'react';
import { Link } from 'react-router-dom';

function Collections(props){
    console.log(props)

    return(
        <div>
            <h1>Collections</h1>
            <Link to={`${props.match.url}/localadaptation`}>Local </Link>
        </div>
    )
}

export default Collections;