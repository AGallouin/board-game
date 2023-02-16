// Import Crates and specific functions from Crates
use mongodb::{
    bson::doc, 
    bson::oid::ObjectId,
    results::InsertOneResult,
    error::Error,
    Client, 
    Collection};
use serde::{Serialize, Deserialize};


/* Login info to get into MongoDB Database */
#[derive(Serialize, Deserialize, Debug)]
pub struct MongoLogInfo {
    pub login: String,
    pub password: String,
}


// Create a specific Public Structure to fit MongoDB Database, with outter attribute coming from the "serde" crate
// The Debug trait added will allow for the println! to use its Display Traits using ":?"
#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub email: String,
    pub password_hash: String,
    pub username: String,
    pub login_state: bool
}



// Create a Specific Public Structure which will contain a MongoDB Collecion
#[derive(Debug)]
pub struct MongoCollection {
    pub collection: Collection<User>
}


// Implementation block to add Methods to MongoCollection Structure
impl MongoCollection {

    // Function that initialize properties of the Structure
    // Launch the connection into MongoDB and return a Structure which contains the user defined mongodb::Collection
    pub async fn get_database(login: &str, password: &str, database_name: &str, collection_name: &str) -> Result<Self, Error> {

        let connection_url: String = format!("mongodb+srv://{}:{}@cluster0.cjovhvv.mongodb.net/?retryWrites=true&w=majority", login, password);
        let client: Result<Client, Error> = Client::with_uri_str(connection_url).await;

        match client {
                Ok(valid_client) => {
                    let db = valid_client.database(database_name);
                    let col: Collection<User> = db.collection(collection_name);

                    println!("Connected successfully to MongoDB Atlas");
                    Ok(MongoCollection { collection: col })
            },
            Err(e) => {
                println!("Error while connecting to mongoDB; receivning the following error: {}", e);
                Err(e)
            }
        }
    }


    // Function to add one User
    pub async fn add_user(&self, new_user: User) -> Result<InsertOneResult, Error> {

        // Create the Struct template that will be serialized from Input
        let new_doc: User = User {
            id: None,
            email: new_user.email,
            password_hash: new_user.password_hash,
            username: new_user.username,
            login_state: new_user.login_state

        };

        println!("Adding the following document to mongoDB collection '{}': {:?}", self.collection.name(), new_doc);

        let result: Result<InsertOneResult, Error> = self
            .collection
            .insert_one(new_doc, None)
            .await;

        result
    }


    /* Function to find a specific User */
    pub async fn get_user(&self, field: &str, search_value: &String) -> Result<User, Error> {

        let filter = doc!{field: search_value};

        let user_detail: Result<User, Error> = self
            .collection
            .find_one(filter, None)
            .await
            .map(|i| i.unwrap());

        user_detail
    }

}