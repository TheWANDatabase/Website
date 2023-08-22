/**
 * NOTE: This file is here as en explainer of the data layouts accepted, and returned by the routes of this API.
 * DO NOT modify it unless you have made any changes to the data formatting used by the API
 * Ensure that all routes and their dependent requests have been updated to match this spec before pushing
 * a build to the remote. Thank you - Altrius.
 */


/**
 * @name StandardResponse
 * @description The default response layout used by every API Endpoint, 
 * and then modified to fit their data layouts
 */
export interface StandardResponse<T> {
    data?: T
    error?: unknown
    time: number
}




/**
 * @interface
 * @name StandardResponse
 * @description The default response layout used by every API Endpoint, 
 * and then modified to fit their data layouts
 */
export interface HistoryRequest {
    /**
     * @name id
     * @description a User ID (in UUIDv4 formatting), 
     * which can be referenced to the user's profile
     */
    id: string
}

export interface HistoryDetails {
    id: string
    viewer: string // -> (references user ID)
    episode: string // -> (references episode ID)
    viewed_seconds: string
    last_watched: String | Date // (Returned as a string, but stored as a Timestamp)
}