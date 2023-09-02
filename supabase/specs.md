# Specs

This project uses multiple different specifications for bit-based encoding of
permissions, and flags, depending on the entity focused by that permission /
flag

The current specifications for all of these can be found in this file.

## Video

### Episode#flag

|        Mask        | Decimal | Flag          | Description                                                                                                                |
| :----------------: | :------ | :------------ | :------------------------------------------------------------------------------------------------------------------------- |
| `0000000000000001` | 1       | Thumb         | Video has a thumbnail                                                                                                      |
| `0000000000000010` | 2       | AOD           | Video has an AOD / Audio On Demand File                                                                                    |
| `0000000000000100` | 4       | VOD           | Video has an VOD / Video On Demand File                                                                                    |
| `0000000000001000` | 8       | WebVTT        | Video has a transcript file available                                                                                      |
| `0000000000010000` | 16      | Private       | Video is private - These videos are not recognized by the API                                                              |
| `0000000000100000` | 32      | Stream        | Video is available via Stream Player ([See Cloudflare docs](https://developers.cloudflare.com/stream/))                    |
| `0000000001000000` | 64      | Live          | Video is currently being actively livestreamed by LMG (This flag should be exclusive!)                                     |
| `0000000010000000` | 128     | Corrupt       | Video is corrupted and users should be warned of this when viewing VOD content.                                            |
| `0000000100000000` | 256     | C/W           | Video has a content warning applied, this is usually because it is an older video before they were so careful about things |
| `0000001000000000` | 512     | Guest         | Video features one or more guests to the show (non LMG staff)                                                              |
| `0000010000000000` | 1,024   | LTX/Trade     | This show was streamed from an LTX or other industry event                                                                 |
| `0000100000000000` | 2,048   | MM            | Video features the use of Merch Messages                                                                                   |
| `0001000000000000` | 4,096   | PL            | Video features the launch of a product by LMG/Creator Warehouse                                                            |
| `0010000000000000` | 8,192   | NEEDTOPIC     | Video needs to be chacked for new topics - Flag remains until the topic count is more than 0                               |
| `0100000000000000` | 16,384  | HAS_WAN_BINGO | Video has an associated WAN Show Bingo instance (spreadsheet?)                                                             |
| `1000000000000000` | 32,768  |               |                                                                                                                            |

> Note: This field currently uses a single 16 bit integer to contains these
> feature flags. Future variants of this spec may change the number of bits, but
> the masks themselves should remain mapped to the same flag for backwards
> compatibility reasons.

---

## User

### Profile#Flag

|     Mask     | Flag                             | Description                                                                                     |
| :----------: | :------------------------------- | :---------------------------------------------------------------------------------------------- |
| `0b00000001` | Owner                            | Represents me, the owner of the project, or whoever owns the project in the future              |
| `0b00000010` | LMG / Yvonne Umbrella Corp Staff | Represents a user who is actively employed by LMG or Yvonne Umbrella corp and it's subsidiaries |
| `0b00000100` | Retired Staff                    | Like the flag above, but for people who have left the company                                   |
| `0b00001000` | Editor                           | Represents somebody who has been given the permission of "editor" (see permissions spec)        |
| `0b00010000` | Early Access                     | Represents somebody who signed up for an account prior to September 16th, 2023                  |

### Profile#Permission

|     Mask     | Permission      | Description                                                                                                                                           |
| :----------: | :-------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0b00000001` | Owner           | Represents me, the owner of the project, or whoever owns the project in the future                                                                    |
| `0b00000010` | Arbitrator      | Represents a user who has the power to overturn conflicts within the timestamp edit history.                                                          |
| `0b00001000` | Editor (Gilded) | Represents a user who has the power to authorize an edit to a timestamp (requires two people)                                                         |
| `0b00010000` | Editor          | Represents a user who has the power to propose edits / changes to timestamps, episodes, and cast members                                              |
| `0b00100000` | Moderator       | Represents a user who has the power to remove live chat messages (for a planned feature), is automatically assigned to anyone with the LMG Staff flag |
