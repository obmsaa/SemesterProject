import pg from "pg"
import hash from "./pswHasher.mjs";



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
        console.log(client);
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
          throw new Error(`Unable to retrieve user details. Please try again later.`);
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
            throw new Error("Error in finding the user with email");
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
            if (result.rows.length > 0) {
                const user = result.rows[0]; 
                // Hashing the input password using the same method as when storing it
                const inputHash = hash(password);
                // Compare the input hash with the stored hash
                if (inputHash === user.password) {
                    console.log("Password matches");
                    
                  return user.id; 
                }
              }
              
              return null; // No user found, or passwords do not match
        } catch (error) {
            console.error(' Error checking user existence:', error);

            throw new Error("Error in finding the user trying to log in, check correct input of email and password");
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
                console.error("Error in finding user with ID: " , user.id, error)
                throw new Error(`Couldn't find the user to change, make sure you are logged in`);
            } 
            

        } catch (error) {
            console.error("Error updating the database with new user info: " + error)
            throw Error("Error updating the database with new user info");

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

           

        } catch (error) {
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
                console.log("User was not created. No rows returned.");
            }

        } catch (error) {
            console.error("User insertion failed with error: " + error);
            throw new Error("Unable to create user")
        } finally {
            client.end(); 
            console.log("Database connection closed.");
        }

        

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
            if (result.rows.length === 0) {
                return []; // Return an empty array if no recipes are found
            }
            const recipes = result.rows;
            
            return recipes; 
        } catch (error) {
            console.error('Error finding recipes:',error); 
            throw new Error("Error finding the recipes. Make sure you are logged in if you want your own recipes")
        } finally {
            await client.end();
        }
    }

    async createRecipe(recipe) {
        const client = new pg.Client(this.#credentials);

        
        try {

            await client.connect();

            const result = await client.query(
                'INSERT INTO "public"."recipes" (title, description, ingredients, instructions, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
                [recipe.title, recipe.description, recipe.ingredients, recipe.instructions, recipe.createdBy]
            );

            if (result.rows.length > 0) {
                const addedRecipe = result.rows[0];
                return addedRecipe;
            } else {
                throw new Error("Recipe creation failed, no rows affected.");
            }

        } catch (error) {
            console.error("Recipe insertion failed with error: " + error);
            throw new Error("Error creating recipe, remember to fill all the fields");
        } finally {
            client.end(); 
            console.log("Database connection closed.");
        }

    

    }
}

 


export default new DBManager();

//