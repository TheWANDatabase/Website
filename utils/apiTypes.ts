/**
 * NOTE: This file is here as en explainer of the data layouts accepted, and returned by the routes of this API.
 * DO NOT modify it unless you have made any changes to the data formatting used by the API
 * Ensure that all routes and their dependent requests have been updated to match this spec before pushing
 * a build to the remote. Thank you - Altrius.
 */

/**
 * The default response layout used by every API Endpoint,
 * and then modified to fit their data layouts
 */
export interface StandardResponse<T> {
    data?: T
    error?: unknown
    time: number
}

/**
 * The input format expected by the /history api endpoint.
 * Anything which does not follow this format, will result in an error.
 */
export interface HistoryRequest {
    /**
     * @name id
     * @description a User ID (in UUIDv4 formatting),
     * which can be referenced to the user's profile
     */
    id: string
}
/**
 * The response format provided by the /history api endpoint.
 */
export interface HistoryDetails {
    /**
     * @name id
     * @description A unique identifier for this history entry (UUIDv4 formatted)
     */
    id: string

    /**
     * @name viewer
     * @description A unique identifier for this history entry (UUIDv4 formatted)
     */
    viewer: string // -> (references user ID)
    episode: string // -> (references episode ID)
    viewed_seconds: string
    last_watched: String | Date // (Returned as a string, but stored as a Timestamp)
}


/**
 * @interface
 * @name HistoryRequest
 * @description The input format expected by the /history api endpoint.
 * Anything which does not follow this format, will result in an error.
 */
export interface HistoryResponse extends StandardResponse<HistoryDetails[]> { }
