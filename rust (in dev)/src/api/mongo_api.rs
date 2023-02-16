// This module is dedicated to Back-end API to fetch MongoDB


// I. Importing Crates and Modules
// Import Modules
use crate::structures;

// Import Crates and specific functions from Modules
use structures::mongo_struct::{User, MongoCollection};
use mongodb::{results::InsertOneResult, error::Error};
use rocket::{get, post, http::Status, serde::json::Json, State};



/* Default page */
#[get("/")]
pub fn default_page() -> &'static str {
    "This is the back end server default page"
}


/* add_user API Handler using rocket */
#[post("/create", format="json", data="<new_user>")]
pub async fn add_user_api(db: &State<MongoCollection>, new_user: Json<User>) -> Result<Json<InsertOneResult>, Status> {
    
    println!("{}", new_user.email.to_owned());
    println!("{}", new_user.password_hash.to_owned());
    println!("{}", new_user.username.to_owned());

    let data: User = User {
        id: None,
        email: new_user.email.to_owned(),
        password_hash: new_user.password_hash.to_owned(),
        username: new_user.username.to_owned(),
        login_state: new_user.login_state.to_owned()
    };

    let user_detail: Result<InsertOneResult, Error> = db.add_user(data).await;

    match user_detail {
        Ok(user) => {
            println!("New user added to the database: {}", db.collection.name());
            Ok(Json(user))
        },
        Err(err) => {println!("{}", err); Err(Status::InternalServerError)}
    }
}


/* get login info API using get_user Handler using rocket */
#[get("/<field>/<search_value>")]
pub async fn login_api(db: &State<MongoCollection>, field: String, search_value: String) -> Result<Json<User>, Status> {

    if field.is_empty() | search_value.is_empty() {
        return Err(Status::BadRequest);
    };

    let user_detail: Result<User, Error> = db.get_user(&field, &search_value).await;
    match user_detail {
        Ok(user) => Ok(Json(user)),
        Err(error_message) => {
            println!("{}", error_message); 
            Err(Status::InternalServerError)
        },
    }
}