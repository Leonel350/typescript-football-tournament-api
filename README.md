# Football Tournament API

This API, made with express using Typescript and MongoDB can manage a football tournament.

The API is divided in:
 - Tournaments
 - Teams
 - Matches


## Tournaments

You can create a new Tournament and give it a name. Inside this tournament you can create teams and matches.

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
### Get Table
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
