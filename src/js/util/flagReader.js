
/**
 * Function to check if the Scene should be in normal or Debug mode. 
 * Debugmode enables the Stats, and some other normaly hidden features
 * TO ENABLE: add ?debug=true to the Link in the Browser-searchbar
 * @returns isDebug enabled
 */
export function isDebug() {
    return new URLSearchParams(globalThis.location.search).get('debug') === 'true';
}

export function isAxis() {
    return new URLSearchParams(globalThis.location.search).get('axis') === 'true';
}
