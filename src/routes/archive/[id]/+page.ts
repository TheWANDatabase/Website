import { getVideo } from "$lib/api";
import type {ServerLoad} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";

export const load = (async ({params}) => {
    if(!params.id) {
        throw error(404, "Cannot find video");
    }
    
    const response = await getVideo(params.id);

    const data = await response.json();

    if(response.status != 200) {
        throw error(response.status, data.message || response.statusText);
    }

    return data;
}) satisfies ServerLoad