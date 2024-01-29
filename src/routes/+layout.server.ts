// import { getVideo } from "$lib/api";
import { getCookie } from "$lib/cookies";
import type {ServerLoad} from "@sveltejs/kit";
// import {error} from "@sveltejs/kit";

export const load = (async ({request, platform}) => {

    const cookie = request.headers.get("cookie");
    const themeCookie = getCookie("tdb.theme", cookie ?? "") ?? "1";
    

    let themeId = parseInt(themeCookie);
    if(!Number.isNaN(themeId) || !Number.isFinite(themeId) || !Number.isSafeInteger(themeId)) themeId = 1;


    console.log(platform?.env.DB)
    console.log(`Requesting details of theme with ID ${themeId}`)
    const theme = await platform?.env.DB.prepare(`SELECT * FROM themes WHERE id = ${themeId}`).first();
    return {theme}
}) satisfies ServerLoad