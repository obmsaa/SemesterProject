
import DBManager from "./storageManager.mjs";


class User {

 
  constructor({ id, name, email, password, role }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }


  async save() {

   try{
    //Depending on the inclusion of an id it will create or update user
    if (this.id == null) {

      return await DBManager.createUser(this) ;

    } else {
      console.log("Ran update user")
      return await DBManager.updateUser(this);
    }
  } catch(error){
    console.error("Failed to save user:", error);
    throw new Error(`Error saving user: `, error.message);
  }
  }

  delete() {

    DBManager.deleteUser(this);
  }


}

export default User;

