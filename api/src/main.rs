// I. Importing Crates and Modules
// Import Modules
mod mongo;


// Import Crates and specific functions from Crates
use std::env;
use dotenv::dotenv;
use mongo::MongoCollection;

//use rocket::{get, launch, post, http::Status, serde::json::Json};
//use mongo::User;
//use mongodb::{results::{InsertOneResult}};
//use rocket::State;





// II. Main Function
#[tokio::main]
async fn main() {

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


    database.insert_one()
    //database.add_user("Test".to_string(), "Popo".to_string());
            
            //rocket::build().manage(db).mount("/", routes![add_user])

    //database.add_user("Test".to_string(), "Popo".to_string()).await?;

}



