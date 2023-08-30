# Specs

This project uses multiple different specifications for bit-based encoding of
permissions, and flags, depending on the entity focused by that permission /
flag

The current specifications for all of these can be found in this file.

## Video

### Episode#flag

|    Mask    | Flag    | Description                                                                                             |
| :--------: | :------ | :------------------------------------------------------------------------------------------------------ |
| `00000001` | Thumb   | Video has a thumbnail                                                                                   |
| `00000010` | AOD     | Video has an AOD / Audio On Demand File                                                                 |
| `00000100` | VOD     | Video has an VOD / Video On Demand File                                                                 |
| `00001000` | WebVTT  | Video has a transcript file available                                                                   |
| `00010000` | Private | Video is private - These videos are not recognized by the API                                           |
| `00100000` | Stream  | Video is available via Stream Player ([See Cloudflare docs](https://developers.cloudflare.com/stream/)) |
| `01000000` | Live    | Video is currently being actively livestreamed by LMG (This flag should be exclusive!)                  |
| `10000000` | Corrupt | Video is corrupted and users should be warned of this when viewing VOD content.                         |

> Note: This field currently uses a single 8 bit integer to contains these
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
