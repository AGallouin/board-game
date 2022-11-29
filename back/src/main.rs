// I. Importing Crates and Modules
// Import Modules
mod api;
mod structures;

// Import Crates and specific functions from Modules
use std::env;
use dotenv::dotenv;
use structures::mongo_struct::{MongoLogInfo, MongoCollection};
use structures::cors_struct::CORS;
use api::mongo_api::{default_page, add_user_api, get_user_api};
use rocket::{launch, routes, options};


/* Function to get MongoDB Atlas Log Information that will be passed in Rocket Launch */
async fn get_log_info() -> MongoLogInfo {

    /* Read Login and Password information from .env file */
    dotenv().expect("Failed to read .env file");
    let login: String = match env::var("MONGO_LOGIN") {
        Ok(value) => value,
        Err(e) => panic!("{e}"),
    };

    let password: String = match env::var("MONGO_PASSWORD") {
        Ok(value) => value,
        Err(e) => panic!("{e}"),
    };

    /* Return MongoDB Atlas Log Information in MongoLogInfo struct */
    MongoLogInfo {
        login,
        password
    }
}


/* Function to initiate MongoDB connection to a specific database/collection */
async fn connect_database(login: &str, password: &str) -> MongoCollection {

    let database_name: &str = "Board_Game";
    let collection_name: &str = "User_List";

    /* Call the get_database method implemented in MongoCollection struct (can be found in src/structures/mongo_struct.rs) */
    let database: MongoCollection = match MongoCollection::get_database(login, password, database_name, collection_name).await {
        Ok(value) => value,
        Err(e) => panic!("{e}"),
    };

    /* Return collection in MongoCollection struct */
    database
}


/// Catches all OPTION requests in order to get the CORS related Fairing triggered.
#[options("/<_..>")]
fn all_options() {
    /* Intentionally left empty */
}


// II. Main Function
#[launch]
async fn rocket() -> _ {
    
    let current_log_info: MongoLogInfo = get_log_info().await;
    let current_database: MongoCollection = connect_database(&current_log_info.login, &current_log_info.password).await;

    rocket::build()
        .attach(CORS)
        .manage(current_log_info)
        .manage(current_database)
        .mount("/users", routes![add_user_api, get_user_api])
        .mount("/", routes![default_page, all_options])
}