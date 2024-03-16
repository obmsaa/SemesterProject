import pg from "pg"
import SuperLogger from "./SuperLogger.mjs";
import { HTTPCodes } from "./httpConstants.mjs";
import hash from "./pswHasher.mjs";
import { giveToken } from "./authenticator.mjs";




/// TODO: is the structure / design of the DBManager as good as it could be?

class DBManager {



    #credentials = {};


    constructor() {
        const isRenderEnvironment = Boolean(process.env.DB_CONNECTIONSTRING_RENDER);
        const connectionString = isRenderEnvironment ? process.env.DB_CONNECTIONSTRING_RENDER : process.env.DB_CONNECTIONSTRING_LOCAL;
        const ssl = isRenderEnvironment ? { rejectUnauthorized: true } : false;


        this.#credentials = {
            connectionString,
            ssl
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

    async checkUserLogin(email, password) {
        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            console.log("client ", client)

           
            const result = await client.query('SELECT * FROM "public"."users" WHERE email = $1', [email]);
            // console.log("console Result in storage: ", result.rows[0])
            if (result.rows.length > 0) {
                const user = result.rows[0]; 
                // Hashing the input password using the same method as when storing it
                const inputHash = hash(password);
                // Compare the input hash with the stored hash
                if (inputHash === user.password) {
                    console.log("Password matches, user ID:", user.id);
                    
                  return user.id; 
                }
              }
              
              return null; // No user found, or passwords do not match
        } catch (error) {
            console.log(' Error checking user existence:', error.message, error.stack);

            throw new Error("Error: ", error);
        } finally {
            await client.end();
        }
    }

    

    async updateUser(user) {

        const client = new pg.Client(this.#credentials);

        try {

            await client.connect();


            const output = await client.query('UPDATE "public"."users" SET "name" = $1, "email" = $2, "password" = $3 WHERE id = $4;', [user.name, user.email, user.password, user.id]);

            if (output.rowCount === 0) {

                throw new Error(`No user found with ID: ${user.id}`);
            } else {

            }
            

        } catch (error) {

            throw Error("Error updating the database with new user info: " + error);
        } finally {

            client.end(); 
       

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
            client.end(); 
            SuperLogger.log("Database connection closed.");
        }

        return user;

    }


    async findRecipes(userID) {
        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            let query;
            let queryParams = [];
    
            if(userID) {                
                // Query for specific user
                query = 'SELECT * FROM "public"."recipes" WHERE created_by = $1';
                queryParams.push(userID);
            } else {
                //Query to get all recipes from everyone
                query = 'SELECT * FROM "public"."recipes"';
            }
    
            const result = await client.query(query, queryParams);
            console.log("Result from storage: ", result)
            if (result.rows.length === 0) {
                return []; // Return an empty array if no recipes are found
            }
            const recipes = result.rows;
            
            return recipes; 
        } catch (error) {
            throw new Error('Error finding recipes:',error); 
        } finally {
            await client.end();
        }
    }
}

 // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.





export default new DBManager();

//