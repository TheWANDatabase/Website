import type {ServerLoad} from "@sveltejs/kit";
// import {error} from "@sveltejs/kit";

export const load = (async (ctx) => {
    console.log(ctx);
    return {};
}) satisfies ServerLoad