-- Search Cast (search_term: Text)
-- Used to search cast members in the editor screen
CREATE OR REPLACE FUNCTION public.search_cast(search_term text)
  RETURNS TABLE(id bigint, created_at timestamp with time zone, name text, alias text, twitter text, linkedin text, mug text, outlet text, outlet_uri text, wikipedia text, instagram text, ltt_forum text, imdb text)
  LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
    SELECT
      *
    FROM
      public."cast"
    WHERE
      "cast".name ilike '%' || search_term || '%'
    ORDER BY
      levenshtein("cast".name, search_term)
    LIMIT 10;
END;
$function$

-- Search Episodes (phrase: Text | ofst: Integer (0) | lmt: Integer (10))
-- ofst = Offset
-- lmt = Limit
-- Used to filter episodes based on the user's query of choice, 
-- this is usually not called directly, but instead passed through a 
-- caching layer to minimise query overhead
CREATE OR REPLACE FUNCTION public.search_episodes(phrase text, ofst integer DEFAULT 0, lmt integer DEFAULT 10)
  RETURNS TABLE(title text, aired date, id text)
  LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
    select
      episodes.title,
      episodes.aired,
      episodes.id
    from
      public.episodes
      left join public.transcriptions on transcriptions.id = episodes.id
    where
      transcriptions.fts @@ websearch_to_tsquery(phrase)
      and episodes.aired is not null
    group by
      episodes.title,
      episodes.aired,
      episodes.id
    order by
      -- LEVENSHTEIN(topics.title, phrase) asc,
      episodes.aired desc,
      episodes.title asc
    offset ofst
    limit lmt;
END;
$function$


-- Search (phrase: Text)
-- Used to allow the user to search for topcis and / or episodes of the show which contain specific keywords
-- Works by comparing the searched phrase against the existing indexes of transcriptions and topic titles in
-- an attempt to find the most likely match, returning the results ordered by their levenshtein distence
CREATE OR REPLACE FUNCTION public.search(phrase text)
  RETURNS TABLE(title text, aired date, id text, matched_topics jsonb)
  LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
    select
      episodes.title,
      episodes.aired,
      episodes.id,
      jsonb_agg(topics) as matched_topics
    from
      public.episodes
      left join public.topics on topics.episode = episodes.id
    where
      topics.title ilike '%'||phrase||'%'
      or topics.description ilike '%'||phrase||'%'
    group by
      episodes.title,
      episodes.aired,
      episodes.id
    order by
      episodes.aired asc,
      episodes.title asc;
END;
$function$
