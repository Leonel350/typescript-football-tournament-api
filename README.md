# Football Tournament API ⚽

This API, made with express using Typescript and MongoDB can manage a football tournament.

The API is divided in:
 - Tournaments
 - Teams
 - Matches

This API is deployed to Heroku using MongoDB Atlas.

**Make requests to `https://football-tournament-api.herokuapp.com/api` to test the API.**

## Tournaments 🏆

You can create a new Tournament and give it a name. Inside this tournament you can create teams and matches.

---

### Create Tournament
Description: **Creates a new tournament.**  
Path: **/tournaments**  
Method: **POST**

Request: (JSON)
| Parameter  | Type  | Description
|--|--|--|
| name | string |The name of the tournament

Response: (JSON, Object)
| Parameter  | Type  | Description
|--|--|--|
| name | string |The name of the tournament
| teams | string |An empty array of teams that play the tournament
| matches | string |An empty array of matches that will be or have been played
| createdAt | date |The creation date of the tournament
| updatedAt | date |The date of the last update of the tournament

---
### Update Tournament
Description: **Updates a tournament.**  
Path: **/tournaments/{id}**  
Method: **PUT**

Request: (JSON)
| Parameter  | Type  | Description
|--|--|--|
| name | string |The name of the tournament

Response: (JSON, Object)
| Parameter  | Type  | Description
|--|--|--|
| name | string |The name of the tournament
| teams | string |An array of teams that play the tournament
| matches | string |An array of matches that will be or have been played
| createdAt | date |The creation date of the tournament
| updatedAt | date |The date of the last update of the tournament

---
### Fetch Tournamets
Description: **Retrives all tournaments**  
Path: **/tournaments**  
Method: **GET**

Response: (JSON, Array of Objects)
| Parameter  | Type  | Description
|--|--|--|
| name | string |The name of the tournament
| teams | string |An array with the ids of the teams that play the tournament
| matches | string |An array with the ids of the matches of the tournament
| createdAt | date |The creation date of the tournament
| updatedAt | date |The date of the last update of the tournament

---
### Get Tournament
Description: **Retrives one tournament**  
Path: **/tournaments/{id}**  
Method: **GET**

Response: (JSON, Object)
| Parameter  | Type  | Description
|--|--|--|
| name | string |The name of the tournament
| teams | string |A composed array with all the information of each team
| matches | string |A composed array with all the information of each match
| createdAt | date |The creation date of the tournament
| updatedAt | date |The date of the last update of the tournament

---

### Delete Tournament
Description: **Removes a tournament**  
Path: **/tournaments/{id}**  
Method: **DELETE**

Response: (JSON, Object)
**All the deleted tournament data**

This action will delete all teams and matches related to the tournament.

---
### Get Table ⭐
Description: **Generates all the information needed for the positions table of the tournament in order of points**  
Path: **/tournaments/{id}/table**  
Method: **GET**

Response: (JSON, Array of Objects)
| Parameter  | Type  | Description
|--|--|--|
| team | string |The name of the team
| badge | string |If it has one, the image for the badge of the team
| _id | string |Id of the team
| played | int |The ammount of matches played by the team
| won | int |The ammount of matches won by the team
| lost | int |The ammount of matches won by the team
| tied | int |The ammount of matches tied by the team
| points | int |The ammount points the team has. (3 per victory, 1 per tie)
| goalsFor | int |The ammount goals made by the team
| goalsAgainst | int |The ammount goals the team conceded
| goalDifference | int |The goal difference (goalsFor-goalsAgainst)

## Teams 🏃‍♀️

You need to create teams for the tournament in  order to create matches.
Teams can optionally have a badge (image url).

---

### Create Team
Description: **Creates a new team.**  
Path: **/tournaments/{tournamentId}/teams**  
Method: **POST**

Request: (JSON)
| Parameter  | Type  | Description
|--|--|--|
| name | string |The name of the team
| badge | string | (Optional) A url of an image for the team badge

Response: (JSON, Object)
| Parameter  | Type  | Description
|--|--|--|
| _id | string |Id of the team
| name | string |The name of the team
| badge | string | (If exists) A url of an image for the team badge 
| matches | string |An empty array with all the ids of the matches the team will or has played
| createdAt | string |The date of the creation of the team
| updatedAt | string |The date of the last update of the team


---

### Update Team
Description: **Updates a team.**  
Path: **/tournaments/{tournamentId}/teams/{id}**  
Method: **PUT**

Request: (JSON)
| Parameter  | Type  | Description
|--|--|--|
| name | string |The name of the team
| badge | string | A url of an image for the team badge

Response: (JSON, Object)
| Parameter  | Type  | Description
|--|--|--|
| _id | string |Id of the team
| name | string |The name of the team
| badge | string | (If exists) A url of an image for the team badge 
| matches | string |An array with all the ids of the matches the team will or has played
| createdAt | string |The date of the creation of the team
| updatedAt | string |The date of the last update of the team

---

### Get Team
Description: **Gets all the information of a team including matches**  
Path: **/tournaments/{tournamentId}/teams/{id}**  
Method: **GET**

Response: (JSON, Object)
| Parameter  | Type  | Description
|--|--|--|
| _id | string |Id of the team
| name | string |The name of the team
| badge | string | (If exists) A url of an image for the team badge 
| matches | string |An array with all the matches of the team with team names and ids
| createdAt | string |The date of the creation of the team
| updatedAt | string |The date of the last update of the team

---

### Fetch Teams
Description: **Gets all the teams of the tournament**  
Path: **/tournaments/{tournamentId}/teams**  
Method: **GET**

Response: (JSON, Array of Objects)
| Parameter  | Type  | Description
|--|--|--|
| _id | string |Id of the team
| name | string |The name of the team
| badge | string | (If exists) A url of an image for the team badge 
| matches | string |An array with the ids of the matches of the team
| createdAt | string |The date of the creation of the team
| updatedAt | string |The date of the last update of the team

---
### Delete Team
Description: **Removes a team from the tournament**  
Path: **/tournaments/{tournamentId}/teams/{id}**  
Method: **DELETE**

Response: (JSON, Object)
**All the data of the deleted team**

This will not delete the teams matches but it will not appear on the table.
For the integrity of the information, its not recomended to delete a team that already has matches.

## Matches 0️⃣-0️⃣
Every tournament has matches. This information will be used to make the torunament positions table.

---

### Create Match
Description: **Creates a new match.**  
Path: **/tournaments/{tournamentId}/matches**  
Method: **POST**

Request: (JSON)
| Parameter  | Type  | Description
|--|--|--|
| team1 | string | The id of the local team
| team2 | string | The id of the visiting team
| score1 | int | (Optional) Number of goals the team 1 made
| score2 | int | (Optional) Number of goals the team 2 made


Response: (JSON, Object)
| Parameter  | Type  | Description
|--|--|--|
| _id | string |Id of the match
| team1 | string | The id of the local team
| team2 | string | The id of the visiting team
| tournament | string |Id of the tournament
| createdAt | string |The date of the creation of the match
| updatedAt | string |The date of the last update of the match
| score1 | int | (If exists) Number of goals the team 1 made
| score2 | int | (If exists) Number of goals the team 2 made

A match can be created without scores and will not be counted on the positions table until it is updated with the result.
---

### Update Match
Description: **Updates the score of a match.**  
Path: **/tournaments/{tournamentId}/matches/{id}**  
Method: **PUT**

Request: (JSON)
| Parameter  | Type  | Description
|--|--|--|
| score1 | int | Number of goals the team 1 made
| score2 | int | Number of goals the team 2 made


Response: (JSON, Object)
| Parameter  | Type  | Description
|--|--|--|
| _id | string |Id of the match
| team1 | string | The id of the local team
| team2 | string | The id of the visiting team
| tournament | string |Id of the tournament
| createdAt | string |The date of the creation of the match
| updatedAt | string |The date of the last update of the match

---
### Get Match
Description: **Get a match with all the teams information**  
Path: **/tournaments/{tournamentId}/matches/{id}**  
Method: **GET**

Response: (JSON, Object)
| Parameter  | Type  | Description
|--|--|--|
| _id | string |Id of the match
| team1 | string | All the information of the local team
| team2 | string | All the information of the visiting team
| tournament | string |Id of the tournament
| createdAt | string |The date of the creation of the match
| updatedAt | string |The date of the last update of the match

---

### Fetch Matches
Description: **Fetch all the matches of the tournament**  
Path: **/tournaments/{tournamentId}/matches**  
Method: **GET**

Response: (JSON, Array of Objects)
| Parameter  | Type  | Description
|--|--|--|
| _id | string |Id of the match
| team1 | string | The id and name of the local team
| team2 | string | The id and name of the visiting team
| tournament | string |Id of the tournament
| createdAt | string |The date of the creation of the match
| updatedAt | string |The date of the last update of the match

---
### Delete Match
Description: **Removes a match from the tournament**  
Path: **/tournaments/{tournamentId}/matches/{id}**  
Method: **DELETE**

Response: (JSON, Object)
**All the data of the deleted match**

This will delete the match and the result will not be counted for the positions table anymore.

---