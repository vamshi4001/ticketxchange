points

services 
- to save user object
- to save city - and update user preference city in his db
- user active/inactive - user rating by previous users
- Define - end trip style - as soon as the ticket is purchased, they should be able to end the post or they will receive unnecessary calls.

- No data pages
- Select city only once check
- Home button on every page and removing backbuttons when not required
- Cancel anywhere and state should return and should start afresh
- Side menu - Movies list, Theatres list, Edit profile, Logout, 
- Login page - user profile page - change phone number or name or photo
- 




Without giving date, how can we show the list of theatres for a movie?
theatre_movie_id is a combination of movie, theatre, show n date - so while selling ticket we need to ask for date initially. 
If it's not there, we should confirm and add that movie to that date or we should decline saying that show is not available for given date.

We are scraping from bookmyshow, so we can decline saying there's no show for given date in given theatre at given show of a given movie.

Date>Movie>Theatre>ShowTime - We'll check if tmid exists and if yes, we proceed - else we say no show n try again.