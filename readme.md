
## POSTGRES REALTIME

Realtime application using Supabase to listen events in postgres and Socket.io to send this database change to client. 


### How to run


run the commands:

1. `docker-compose up --build` - Create the database and Supabase;
2. `npm install` - Install all modules;
3. `npm start` - Run the project.
4. Enter `localhost:8181` in your browser to you can see the data;
5. Now, change the column `status_id` value in 'Service' table and se in your browser these data changing :)