// This module is dedicated to Back-end API to fetch MongoDB


// I. Importing Crates and Modules
// Import Modules
use crate::structures;

// Import Crates and specific functions from Modules
use structures::mongo_struct::{MongoLogInfo, User, MongoCollection};
use mongodb::results::InsertOneResult;
use rocket::{get, post, delete, http::Status, serde::json::Json, State};


// Launch page
#[get("/")]
pub fn launch_page(current_log_info: &State<MongoLogInfo>) -> Json<MongoLogInfo> {

    let test = MongoLogInfo {
        login: current_log_info.login.to_owned(),
        password: current_log_info.password.to_owned()
    };
    
    Json(test)
}



// add_user API Handler using rocket
#[post("/", format="json", data="<new_user>")]
pub async fn add_user(db: &State<MongoCollection>, new_user: Json<User>) -> Result<Json<InsertOneResult>, Status> {
    
    println!("{}", new_user.login.to_owned());

    let data = User {
        //id: None,
        login: new_user.login.to_owned(),
        password: new_user.password.to_owned(),
    };

    let user_detail = db.add_user(data).await;

    match user_detail {
        Ok(user) => {
            println!("New user added");
            Ok(Json(user))
        },
        Err(_) => Err(Status::InternalServerError),
    }
}









/* pub fn get_all_users(&self) -> Result<Vec<User>, Error> {
    let cursors = self
        .col
        .find(None, None)
        .ok()
        .expect("Error getting list of users");
    let users = cursors.map(|doc| doc.unwrap()).collect();
    Ok(users)
} */

/* // find_user API Handler
#[get("/<login>")]
pub async fn get_user(db: &State<MongoCollection>, login: String) -> Result<Json<User>, Status> {

    println!("{}", login);
    if login.is_empty() {
        return Err(Status::BadRequest);
    };

    let user_detail = db.find_user(&login).await;
    match user_detail {
        Ok(user) => Ok(Json(user)),
        Err(error_message) => {
            println!("{}", error_message); 
            Err(Status::InternalServerError)
        },
    }
} */










// remove_user API Handler using rocket
/* #[delete("/user/<login>")]
pub async fn remove_user(db: &State<MongoCollection>, login: String) -> Result<Json<&str>, Status> {

    if login.is_empty() {
        return Err(Status::BadRequest);
    };

    let result = db.remove_user(&login).await;
    match result {
        Ok(res) => {
            if res.deleted_count == 1 {
                return Ok(Json("User successfully deleted!"));
            } else {
                return Err(Status::NotFound);
            }
        }
        Err(_) => Err(Status::InternalServerError),
    }
} */