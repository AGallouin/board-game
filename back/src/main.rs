// I. Importing Crates and Modules
// Import Modules
mod api;
mod structures;

// Import Crates and specific functions from Modules
use std::env;
use dotenv::dotenv;
use structures::mongo_struct::{MongoLogInfo, MongoCollection};
use structures::rocket_struct::CORS;
use api::mongo_api::{launch_page, add_user};
use rocket::{launch, routes};


async fn get_log_info() -> MongoLogInfo {

    dotenv().expect("Failed to read .env file");
    let login = match env::var("MONGO_LOGIN") {
        Ok(value) => value,
        Err(e) => panic!("{e}"),
    };

    let password = match env::var("MONGO_PASSWORD") {
        Ok(value) => value,
        Err(e) => panic!("{e}"),
    };

    MongoLogInfo {
        login,
        password
    }
}


async fn connect_database(login: &str, password: &str) -> MongoCollection {

    let database = match MongoCollection::get_database(login, password, "Test_db", "Test_coll").await {
        Ok(value) => value,
        Err(e) => panic!("{e}"),
    };

    database
}


// II. Main Function
#[launch]
async fn rocket() -> _ {
    
    let current_log_info = get_log_info().await;
    let current_database = connect_database(&current_log_info.login, &current_log_info.password).await;

    rocket::build()
        .attach(CORS)
        .manage(current_log_info)
        .manage(current_database)
        .mount("/hello", routes![launch_page])
        .mount("/", routes![add_user])
        //.mount("/user", routes![get_user])
        //.mount("/", routes![remove_user])
}





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