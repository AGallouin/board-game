use super::mongo::{User, MongoCollection};
use mongodb::results::InsertOneResult;
use rocket::{post, http::Status, serde::json::Json, State};


// Add_user API Handler using rocket
#[post("/user", data = "<new_user>")]
pub async fn add_user(db: &State<MongoCollection>, new_user: Json<User>) -> Result<Json<InsertOneResult>, Status> {
    
    let data = User {
        id: None,
        first_name: new_user.first_name.to_owned(),
        last_name: new_user.last_name.to_owned(),
    };

    let user_detail = db.add_user(data).await;

    match user_detail {
        Ok(user) => Ok(Json(user)),
        Err(_) => Err(Status::InternalServerError),
    }
}