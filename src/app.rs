use leptos::*;
use leptos_meta::*;
use leptos_router::*;

use crate::components::generics::*;
use crate::pages::*;

#[component]
pub fn App() -> impl IntoView {
    // Provides context that manages stylesheets, titles, meta tags, etc.
    provide_meta_context();

    view! {
        // injects a stylesheet into the document <head>
        // id=leptos means cargo-leptos will hot-reload this stylesheet
        <Stylesheet id="leptos" href="/pkg/leptos_start.css"/>

        // sets the document title
        <Title text="Welcome to Leptos"/>
        <Meta charset="utf8" />
        <Meta name="description" content="A Leptos fan site."/>
        <Meta name="favicon" content="/favicon.ico"/>

        // content for this welcome page
        <Router>
            <main>
                <header::Header />
                <Routes>
                    <Route path="" view=landing::HomePage/>
                    <Route path="/__design" view=__design::DesignPreview />
                    <Route path="/*any" view=not_found::NotFound/>
                </Routes>
            </main>
        </Router>
    }
}





