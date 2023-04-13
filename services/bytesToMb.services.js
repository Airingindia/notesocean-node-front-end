const  bytesToMb = (bytes) =>  {
    
    const mb = bytes / 1048576;
    return mb.toFixed(2)+" "+'MB';
}


module.exports = {
    get : bytesToMb
}