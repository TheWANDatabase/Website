use leptos::*;

/// Renders the site header.
#[component]
pub fn Header() -> impl IntoView {
    view! {
        <div class="header">
            <a href="/">
                <h2>Greetings From Leptos</h2>
            </a>

            <a href="/cast">
                <h4>Cast List</h4>
            </a>

            <a href="/products">
                <h4>Product List</h4>
            </a>

            <a href="/sponsors">
                <h4>Sponsor List</h4>
            </a>
        </div>
    }
}
