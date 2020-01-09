function reverseArrayInPlace(array){
    for (let i = 0; i < Math.floor(array.length / 2); i++){
        let old = array[i];
        array[i] = array[array.length - 1 - i];
        array[array.length - 1 - i] = old;
    }
    return array;
}

function timer(f){
    return(...args)=>{
        start = Date.getTime();
        result = f(...args);
        end = Date.getTime();
        console.log(end - start);
        return result;
    }
}

function withinRange(array, num){
    for(let a of array){
        if (num >= a[0] && num <= a[1]) {
          return true;
        }
        else{
          return false;
        }
    }
}
