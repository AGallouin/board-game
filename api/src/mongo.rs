// Import Crates and specific functions from Crates
use mongodb::{bson::doc, bson::oid::ObjectId, Client, Collection};
use serde::{Serialize, Deserialize};
use futures::stream::{TryStreamExt};


// Create a specific Public Structure to fit MongoDB Database, with outter attribute coming from the "serde" crate
// The Debug trait added will allow for the println! to use its Display Traits using ":?"
#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub first_name: String,
    pub last_name: String,
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
    pub async fn get_database(login: &str, password: &str, db_name: &str, collection_name: &str) -> mongodb::error::Result<Self> {

        let connection_url = format!("mongodb+srv://{}:{}@cluster0.cjovhvv.mongodb.net/?retryWrites=true&w=majority", login, password);
        let client = Client::with_uri_str(connection_url).await;

        match client {
                Ok(valid_client) => {
                println!("Connected successfully to MongoDB Atlas");

                let db = valid_client.database(db_name);
                let col = db.collection::<User>(collection_name);
                
                //col.insert_one(User {id: None, first_name: "popo".to_string(), last_name: "papa".to_string()}, None).await?;
                Ok(MongoCollection { collection: col })

            },
            Err(e) => Err(e),
        }
    }


    // Function to add one User
    pub async fn add_user(&self, first_name: String, last_name: String) -> mongodb::results::InsertOneResult {

        let result = self
            .collection
            .insert_one(User {id: None, first_name, last_name}, None)
            .await
            .expect("Error while adding a new user!");

        result
    }


    // Function to find a specific User
    pub async fn find_user(&self, field: String, value: String) -> mongodb::error::Result<()> {

        let filter = doc!{field: value};

        let mut cursor = self
            .collection
            .find(filter, None)
            .await?;

        while let Some(user) = cursor.try_next().await? {
            println!("{:?}", user);
        };

        Ok({})
    }


    // Function to remove one User
    pub async fn remove_user(&self, field: String, value: String) -> mongodb::results::DeleteResult {

        let result = self
            .collection
            .delete_one(doc!{field: value}, None)
            .await
            .expect("Error while deleting user!");

        result
    }
}