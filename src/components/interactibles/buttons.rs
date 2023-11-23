use leptos::*;

/// Renders the site header.
#[component]
pub fn Filled(
    children: Children,
) -> impl IntoView {
    view! {
        <button class="filled_button">
            {children()}
        </button>
    }
}
