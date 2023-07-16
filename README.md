# NodeAssignament
clone the Repository
Open in visual studio code
open integrated terminal 
Run npm install command
change the mysql username and password in config/default.json 
{
    "port": 3001,
    "database": {
      "mysql": {
        "host": "localhost",
        "username": "user", /* change to your username */
        "password": "123", /* change to your password */
        "dbName": "assignment" /* database name */
      }
    }
}
type npm run serve to start the server 
when starting the server a super admin user wll automattically create with the following Email and Password
{
    "Email": "superadmin@gmail.com",
    "Password": "superadmin@123"
}
Once the superadmin logged in a token will generate use that token as Bearer token.
Then other process can execute
