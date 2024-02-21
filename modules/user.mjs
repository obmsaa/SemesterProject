
import DBManager from "./storageManager.mjs";

/*  
// If you dont want to use class, this is one alternative

const User = function () {
  return {
    email: "",
    pswHash: "",
    name: "",
    id: null,
    save: Save,
  };

  function Save() {
    console.log(this.name);
  }
};

}*/


class User {

 
  constructor() {
    this.id;
    this.name;
    this.email;
    this.password;
    this.role
  }




  async save() {

    /// TODO: What happens if the DBManager fails to complete its task?

    // We know that if a user object dos not have the ID, then it cant be in the DB.
    if (this.id == null) {
      return await DBManager.createUser(this);
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