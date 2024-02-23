import pg from "pg"
import SuperLogger from "./SuperLogger.mjs";
import { HTTPCodes } from "./httpConstants.mjs";

// We are using an enviorment variable to get the db credentials 
if (process.env.DB_CONNECTIONSTRING == undefined) {
    throw ("You forgot the db connection string");
}

/// TODO: is the structure / design of the DBManager as good as it could be?

class DBManager {

    #credentials = {};

    constructor(connectionString) {
        this.#credentials = {
            connectionString,
            ssl: (process.env.DB_SSL === "true") ? process.env.DB_SSL : false
        };

    }


    async findUserById(userId) {
        const client = new pg.Client(this.#credentials);

        try {
          await client.connect();
          const result = await client.query('SELECT * FROM "public"."users" WHERE id = $1', [userId]);
      
          if (result.rows.length === 0) {
            return null;
          }
      
          const user = result.rows[0];
      
          return user;
        } catch (error) {
          console.error('Error finding user:', error);
          throw new Error(error); // Re-throw for handling in API endpoint
        } finally {
          await client.end();
        }
      }

      async checkUserExists(email) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();

            const result = await client.query('SELECT * FROM "public"."users" WHERE email = $1', [email]);
            
            return result.rows.length > 0; // Returning true if user exists, false otherwise
        } catch (error) {
            console.error('Error checking user existence:', error);
            throw new Error("Error: ", error);
        } finally {
            await client.end();
        }
    }

    async updateUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Update "public"."Users" set "name" = $1, "email" = $2, "password" = $3 where id = $4;', [user.name, user.email, user.password, user.id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special interest is the rows and rowCount properties of this object.

            //TODO Did we update the user?

        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;

    }

    async deleteUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Delete from "public"."Users"  where id = $1;', [user.id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO: Did the user get deleted?

        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;
    }

    async createUser(user) {
        const client = new pg.Client(this.#credentials);
        console.log("New user: ", JSON.stringify(user))

        try {

            await client.connect();
            console.log("Connected to the database successfully.");

            const output = await client.query('INSERT INTO "public"."users"("name", "email", "password", "role") VALUES($1::Text, $2::Text, $3::Text, $4::Text) RETURNING id;', [user.name, user.email, user.password, user.role]);
            console.log("Query executed, result: " + JSON.stringify(output));
            

            if (output.rows.length == 1) {
                // We stored the user in the DB.
                user.id = output.rows[0].id;
                return user;
            } else{
                SuperLogger.log("User was not created. No rows returned.");
            }

        } catch (error) {
            SuperLogger.log("User insertion failed with error: " + error.message);
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
            SuperLogger.log("Database connection closed.");
        }

        return user;

    }

}


 // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.





export default new DBManager(process.env.DB_CONNECTIONSTRING);

//