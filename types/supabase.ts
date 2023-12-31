export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            cast: {
                Row: {
                    alias: string | null
                    created_at: string | null
                    id: number
                    linkedin: string | null
                    mug: string | null
                    name: string | null
                    outlet: string | null
                    outlet_uri: string | null
                    twitter: string | null
                }
                Insert: {
                    alias?: string | null
                    created_at?: string | null
                    id?: number
                    linkedin?: string | null
                    mug?: string | null
                    name?: string | null
                    outlet?: string | null
                    outlet_uri?: string | null
                    twitter?: string | null
                }
                Update: {
                    alias?: string | null
                    created_at?: string | null
                    id?: number
                    linkedin?: string | null
                    mug?: string | null
                    name?: string | null
                    outlet?: string | null
                    outlet_uri?: string | null
                    twitter?: string | null
                }
                Relationships: []
            }
            contributors: {
                Row: {
                    contributions: string | null
                    created_at: string | null
                    id: number
                    name: string | null
                    url: string | null
                }
                Insert: {
                    contributions?: string | null
                    created_at?: string | null
                    id?: number
                    name?: string | null
                    url?: string | null
                }
                Update: {
                    contributions?: string | null
                    created_at?: string | null
                    id?: number
                    name?: string | null
                    url?: string | null
                }
                Relationships: []
            }
            episode_progression: {
                Row: {
                    episode: string
                    id: string
                    last_watched: string
                    viewed_seconds: number
                    viewer: string
                }
                Insert: {
                    episode: string
                    id?: string
                    last_watched?: string
                    viewed_seconds?: number
                    viewer: string
                }
                Update: {
                    episode?: string
                    id?: string
                    last_watched?: string
                    viewed_seconds?: number
                    viewer?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'episode_progression_episode_fkey'
                        columns: ['episode']
                        referencedRelation: 'episodes'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'episode_progression_viewer_fkey'
                        columns: ['viewer']
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    }
                ]
            }
            episodes: {
                Row: {
                    aired: string | null
                    cast: number[]
                    description: string | null
                    duration: number
                    duration_text: string
                    flags: number
                    floatplane: string | null
                    id: string
                    last_modified: string | null
                    title: string | null
                    topic_count: number | null
                    youtube: string | null
                }
                Insert: {
                    aired?: string | null
                    cast?: number[]
                    description?: string | null
                    duration?: number
                    duration_text?: string
                    flags?: number
                    floatplane?: string | null
                    id: string
                    last_modified?: string | null
                    title?: string | null
                    topic_count?: number | null
                    youtube?: string | null
                }
                Update: {
                    aired?: string | null
                    cast?: number[]
                    description?: string | null
                    duration?: number
                    duration_text?: string
                    flags?: number
                    floatplane?: string | null
                    id?: string
                    last_modified?: string | null
                    title?: string | null
                    topic_count?: number | null
                    youtube?: string | null
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    flags: number
                    full_name: string | null
                    id: string
                    permissions: number
                    updated_at: string | null
                    username: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    flags?: number
                    full_name?: string | null
                    id: string
                    permissions?: number
                    updated_at?: string | null
                    username?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    flags?: number
                    full_name?: string | null
                    id?: string
                    permissions?: number
                    updated_at?: string | null
                    username?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'profiles_id_fkey'
                        columns: ['id']
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    }
                ]
            }
            topics: {
                Row: {
                    accepted: boolean
                    contributor: number | null
                    description: string | null
                    endpoint: number
                    episode: string
                    fts: unknown | null
                    id: string
                    last_modified: string | null
                    notes: Json
                    revisions: Json[]
                    section: boolean
                    timestamp: string
                    timestamp_raw: number
                    title: string
                    url: string | null
                }
                Insert: {
                    accepted?: boolean
                    contributor?: number | null
                    description?: string | null
                    endpoint?: number
                    episode: string
                    fts?: unknown | null
                    id?: string
                    last_modified?: string | null
                    notes?: Json
                    revisions?: Json[]
                    section?: boolean
                    timestamp: string
                    timestamp_raw?: number
                    title?: string
                    url?: string | null
                }
                Update: {
                    accepted?: boolean
                    contributor?: number | null
                    description?: string | null
                    endpoint?: number
                    episode?: string
                    fts?: unknown | null
                    id?: string
                    last_modified?: string | null
                    notes?: Json
                    revisions?: Json[]
                    section?: boolean
                    timestamp?: string
                    timestamp_raw?: number
                    title?: string
                    url?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'topics_contributor_fkey'
                        columns: ['contributor']
                        referencedRelation: 'contributors'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'topics_episode_fkey'
                        columns: ['episode']
                        referencedRelation: 'episodes'
                        referencedColumns: ['id']
                    }
                ]
            }
            user_statistics: {
                Row: {
                    total_watch_time: number
                    user_id: string
                }
                Insert: {
                    total_watch_time?: number
                    user_id: string
                }
                Update: {
                    total_watch_time?: number
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'user_statistics_user_id_fkey'
                        columns: ['user_id']
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            search:
            | {
                Args: {
                    phrase: string
                }
                Returns: {
                    title: string
                    aired: string
                    id: string
                    matched_topics: Json
                }[]
            }
            | {
                Args: {
                    phrase: string
                    ofst?: number
                    lmt?: number
                }
                Returns: {
                    title: string
                    aired: string
                    id: string
                    matched_topics: Json
                }[]
            }
            search_cast: {
                Args: {
                    search_term: string
                }
                Returns: {
                    id: number
                    created_at: string
                    name: string
                    alias: string
                    twitter: string
                    linkedin: string
                    mug: string
                    outlet: string
                    outlet_uri: string
                }[]
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
