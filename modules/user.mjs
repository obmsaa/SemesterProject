
import SuperLogger from "./SuperLogger.mjs";
import DBManager from "./storageManager.mjs";


class User {

 
  constructor({ name, email, password, role }) {
    this.id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }


  async save() {

    /// TODO: What happens if the DBManager fails to complete its task?

    // We know that if a user object does not have the ID, then it cant be in the DB.
    if (this.id == null) {

      return await DBManager.createUser(this) ;

    } else {
      return await DBManager.updateUser(this);
    }
  }

  delete() {

    /// TODO: What happens if the DBManager fails to complete its task?
    DBManager.deleteUser(this);
  }


}

export default User;