#Registry

##SignalR demo for concurrent updates

Installation notes:

- In `web.config`, adjust the database connection string to point to your local database.
- The Models folder contains a file - `CreateStudentsTableDDL.sql` - that will create the Students table and populate it with 1 record.
- If you get "The project type is not supported by this installation." install MVC4.
- SignalR.Client.dll is required to build and is in the dll folder.
