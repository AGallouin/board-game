// I. Importing Crates and Modules
    // Import Modules
mod mongo;
mod api;


    // Import Crates and specific functions from Crates
use std::env;
use dotenv::dotenv;
use mongo::MongoCollection;
use api::add_user;
use rocket::{launch, routes};



// II. Main Function
#[launch]
async fn rocket() -> _ {
    
    dotenv().expect("Failed to read .env file");
    let login = match env::var("MONGO_LOGIN") {
        Ok(value) => value,
        Err(e) => panic!("{e}"),
    };

    let password = match env::var("MONGO_PASSWORD") {
        Ok(value) => value,
        Err(e) => panic!("{e}"),
    };

    let database = match MongoCollection::get_database(&login, &password, "Test_db", "Test_coll").await {
        Ok(value) => value,
        Err(e) => panic!("{e}"),
    };

    rocket::build()
        .manage(database)
        .mount("/", routes![add_user])


    // Add new User (Use of match as "add_user" returns Result<T, E>) directly in terminal without API
    //use mongo::User;
    //match database.add_user(User {id:None, first_name:"Autre".to_string(), last_name:"Jack".to_string()}).await {
    //    Ok(_) => println!("User added in Database"),
    //    Err(e) => panic!("{e}"),
    //};

    // Find User directly in terminal without API
    //database.find_user("first_name".to_string(), "Aki".to_string()).await;
    
    // Delete User (Use of match as "remove_user" returns Result<T, E>) directly in terminal without API
    //match database.remove_user("first_name".to_string(), "Autre".to_string()).await {
    //    Ok(_) => println!("User deleted from Database"),
    //    Err(e) => panic!("{e}"),  
    //};

}




