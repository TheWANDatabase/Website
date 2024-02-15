-- Table Declarations --

CREATE TABLE IF NOT EXISTS themes
(
    id       integer primary key autoincrement,
    author   text    not null,
    spec     text    not null default '0.0.1',
    added    text    not null,
    modified text    not null,
    body     text    not null,
    title    text    not null,
    official boolean not null default false,
    version  text    not null default '0.0.1'
);

CREATE TABLE IF NOT EXISTS episodes
(
    id                      text    not null unique primary key,
    floatplane              text,
    title                   text    not null,
    description             text    not null default 'Description Unavailable',
    thumbnail               text,
    aired                   integer,
    duration                integer not null default 0,
    intro_timestamp         integer not null default 0,
    intro_duration          integer not null default 30,
    outro_timestamp         integer not null default 0,
    pre_show_duration       integer not null default 0,
    has_youtube_captions    boolean not null default false,
    has_floatplane_captions boolean not null default false,
    has_guests              boolean not null default false,
    is_live                 boolean not null default false,
    is_corrupt              boolean not null default false,
    has_product_launch      boolean not null default false,
    has_merch_messages      boolean not null default false,
    has_content_warning     boolean not null default false
);


CREATE TABLE IF NOT EXISTS companies
(
    id    text not null unique primary key,
    name  text not null,
    logo  text unique,
    links text not null default '[]'
);

CREATE TABLE IF NOT EXISTS roles
(
    id      text not null unique primary key,
    title   text not null,
    company text not null,
    host    text not null
);

CREATE TABLE IF NOT EXISTS hosts
(
    id             text not null unique primary key,
    forename       text not null default '',
    middle_names   text not null default '',
    surname        text not null default '',
    preferred_name text not null default '',
    alias          text not null default '',
    display_name   text not null default '',
    user           text,
    photo          text unique
);

CREATE TABLE IF NOT EXISTS credits
(
    id      integer not null primary key autoincrement,
    episode text    not null,
    role    text    not null
);

CREATE TABLE IF NOT EXISTS users
(
    id           text    not null primary key,
    avatar       text unique,
    created      integer not null default 0,
    last_seen    integer not null default 0,
    permissions  integer not null default 0,
    display_name text    not null,
    username     text    not null unique,
    banned       boolean not null default false,
    system       boolean not null default false
);

CREATE TABLE IF NOT EXISTS user_preferences
(
    id           text not null unique primary key,
    display_name text not null,
    username     text not null unique,
    email        text not null unique,
    password     text not null unique,
    banned       boolean default false
);

CREATE TABLE IF NOT EXISTS topics
(
    id           text not null unique primary key,
    episode      text not null,
    event_type   text not null,
    metadata     text,
    title        text not null,
    depth        integer not null default 0,
    start        integer not null default 0,
    end          integer not null default 0,
    created      integer not null default 0,
    modified     integer not null default 0
);




-- Table Indexing --

CREATE INDEX IF NOT EXISTS idx_themes_author ON themes (author);
CREATE INDEX IF NOT EXISTS idx_themes_title ON themes (title);
CREATE INDEX IF NOT EXISTS idx_themes_official ON themes (official);
CREATE INDEX IF NOT EXISTS idx_themes_version ON themes (version);
CREATE INDEX IF NOT EXISTS idx_themes_spec ON themes (spec);
CREATE INDEX IF NOT EXISTS idx_episodes_floatplane ON episodes (floatplane);
CREATE INDEX IF NOT EXISTS idx_episodes_title ON episodes (title);
CREATE INDEX IF NOT EXISTS idx_episodes_aired ON episodes (aired);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies (name);
CREATE INDEX IF NOT EXISTS idx_roles_host ON roles (host);
CREATE INDEX IF NOT EXISTS idx_hosts_user ON hosts (user); 
CREATE INDEX IF NOT EXISTS idx_credits_episode ON credits (episode);
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_topics_episode ON topics (episode);

-- Table Seeding --

INSERT INTO users
    (id, display_name, username)
VALUES 
    ('7dd95843-442d-41d1-8f1d-2e5b45f415fe', 'System', 'system'),
    ('d6ecc832-4c9d-4e2c-a121-b646e2cdd645','NoKi1119','noki1119');

INSERT INTO themes
    (author, added, modified, body, title, official)
VALUES ('7dd95843-442d-41d1-8f1d-2e5b45f415fe', '2024-01-13T20:06:19.691Z', '2024-01-13T20:06:19.691Z',
        '{ "name":"Night", "loadingOpacity":1, "loadedOpacity":0, "loaderDisplay":"-100vh", "brand":"184,43,32", "primary":"var(--brand)", "secondary":"62,83,153", "bgPrimary":"22,22,26", "bgSecondary":"36,36,50", "bgTertiary":"45,45,55", "bgAccent":"36,36,50", "bgSecondaryAccent":"40,40,55", "textPrimary":"200,200,200", "textAccent":"230,230,230", "messageBar":"var(--primary)", "messageBarUrgent":"153, 62, 62", "plyrColorMain":"rgb(var(--brand))" }',
        'Night', true);

INSERT INTO themes (author, added, modified, body, title, official)
VALUES ('7dd95843-442d-41d1-8f1d-2e5b45f415fe', '2024-01-13T20:06:19.691Z', '2024-01-13T20:06:19.691Z';
        '{ "name":"Day", "loadingOpacity":1, "loadedOpacity":0, "loaderDisplay":"-100vh", "brand":"184,43,32", "primary":"var(--brand)", "secondary":"62,83,153", "bgPrimary":"237,231,212", "bgSecondary":"187,181,185", "bgTertiary":"170,181,155", "bgAccent":"10,10,10", "bgSecondaryAccent":"130,155,185", "textPrimary":"30,30,30", "textAccent":"200,200,200", "messageBar":"var(--primary)", "messageBarUrgent":"153, 62, 62", "plyrColorMain":"rgb(var(--secondary))" }',
        'Day', true);