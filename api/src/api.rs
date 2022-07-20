use super::mongo::{User, MongoCollection};
use mongodb::results::InsertOneResult;
use rocket::{get, post, delete, http::Status, serde::json::Json, State};



// Launch page
#[get("/")]
pub fn launch_page() -> &'static str {
    "Welcome to #My_Board_Game"
}


// add_user API Handler using rocket
#[post("/user", data = "<new_user>")]
pub async fn add_user(db: &State<MongoCollection>, new_user: Json<User>) -> Result<Json<InsertOneResult>, Status> {
    
    let data = User {
        id: None,
        login: new_user.login.to_owned(),
        password: new_user.password.to_owned(),
    };

    let user_detail = db.add_user(data).await;
    match user_detail {
        Ok(user) => Ok(Json(user)),
        Err(_) => Err(Status::InternalServerError),
    }
}


// find_user API Handler using rocket
#[get("/user/<login>")]
pub async fn find_user(db: &State<MongoCollection>, login: String) -> Result<Json<User>, Status> {

    if login.is_empty() {
        return Err(Status::BadRequest);
    };

    let user_detail = db.find_user(&login).await;
    match user_detail {
        Ok(user) => Ok(Json(user)),
        Err(_) => Err(Status::InternalServerError),
    }
}



// remove_user API Handler using rocket
#[delete("/user/<login>")]
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
}