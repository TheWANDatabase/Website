CREATE TABLE IF NOT EXISTS themes (
    id integer primary key autoincrement,
    author text not null,
    spec text not null default '0.0.1',
    added text not null,
    modified text not null,
    body text not null,
    title text not null,
    official boolean not null default false
)

INSERT INTO themes (author, added, modified, body, title, official) VALUES ('7dd95843-442d-41d1-8f1d-2e5b45f415fe', '2024-01-13T20:06:19.691Z', '2024-01-13T20:06:19.691Z', '{ "name":"Night", "loadingOpacity":1, "loadedOpacity":0, "loaderDisplay":"-100vh", "brand":"184,43,32", "primary":"var(--brand)", "secondary":"62,83,153", "bgPrimary":"22,22,26", "bgSecondary":"36,36,50", "bgTertiary":"45,45,55", "bgAccent":"36,36,50", "bgSecondaryAccent":"40,40,55", "textPrimary":"200,200,200", "textAccent":"230,230,230", "messageBar":"var(--primary)", "messageBarUrgent":"153, 62, 62", "plyrColorMain":"rgb(var(--brand))" }', 'Night', true)
INSERT INTO themes (author, added, modified, body, title, official) VALUES ('7dd95843-442d-41d1-8f1d-2e5b45f415fe', '2024-01-13T20:06:19.691Z', '2024-01-13T20:06:19.691Z', '{ "name":"Day", "loadingOpacity":1, "loadedOpacity":0, "loaderDisplay":"-100vh", "brand":"184,43,32", "primary":"var(--brand)", "secondary":"62,83,153", "bgPrimary":"237,231,212", "bgSecondary":"187,181,185", "bgTertiary":"170,181,155", "bgAccent":"10,10,10", "bgSecondaryAccent":"130,155,185", "textPrimary":"30,30,30", "textAccent":"200,200,200", "messageBar":"var(--primary)", "messageBarUrgent":"153, 62, 62", "plyrColorMain":"rgb(var(--secondary))" }', 'Day', true)
