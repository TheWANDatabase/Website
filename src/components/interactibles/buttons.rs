use leptos::*;

/// Renders the site header.
#[component]
pub fn Filled(
    #[prop(into)]
    click: fn(ev::MouseEvent),
    children: Children,
) -> impl IntoView {
    view! {
        <button class="filled_button" on:click=click>
            {children()}
        </button>
    }
}
