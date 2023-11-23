use leptos::*;

/// Renders the home page of your application.
#[component]
pub fn DesignPreview() -> impl IntoView {
    // Creates a reactive value to update the button
    let (count, set_count) = create_signal(0);

    let on_click = move |m: MouseEvent| {
        set_count.update(|count| *count += 1);
        debug!("Clicked");
        debug!("{:?}", m);
    };

    view! {
        <h1>Interactibles</h1>
        <div style="display: flex">
            <div style="margin-right: 1rem">
                <h2>Buttons</h2>
                <h3>Filled</h3>
                <div on:click=on_click>
                    <interactibles::buttons::Filled>"Click Me: " {count}</interactibles::buttons::Filled>
                </div>
            </div>
        </div>
    }
}