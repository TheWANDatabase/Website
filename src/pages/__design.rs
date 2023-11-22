use leptos::*;

use crate::components::*;

/// Renders the home page of your application.
#[component]
pub fn DesignPreview() -> impl IntoView {
    // Creates a reactive value to update the button
    let (count, set_count) = create_signal(0);
    // let on_click = |_| set_count.update(|count| *count += 1);

    view! {
        <h1>Interactibles</h1>
        <div style="display: flex">
            <interactibles::buttons::Filled>"Click Me: " {count}</interactibles::buttons::Filled>
        </div>
    }
}