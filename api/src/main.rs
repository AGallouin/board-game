use std::env;
use dotenv::dotenv;
use mongodb::{bson::doc, options::ClientOptions, Client};
use serde::{Serialize, Deserialize};
use futures::stream::{TryStreamExt};


// Create a specific Structure to fit MongoDB Database
#[derive(Serialize, Deserialize, Debug)]
struct User {
    first_name: String,
    last_name: String,
}

// Function to add one User
async fn add_user(coll: mongodb::Collection:: <User>, first_name: String, last_name: String) -> mongodb::error::Result<()> {
    coll.insert_one(User {first_name, last_name}, None).await?;
    println!("Added Successfully");
    Ok({})
}

// Function to find User
async fn find_user(coll: mongodb::Collection:: <User>, field: String, value: String) -> mongodb::error::Result<()> {
    let filter = doc!{field: value};
    let mut cursor = coll.find(filter, None).await?;
    while let Some(user) = cursor.try_next().await?{
        println!("{:?}", user);
    }
    Ok({})
}

// Function to remove one User
async fn remove_user(coll: mongodb::Collection:: <User>, field: String, value: String) -> mongodb::error::Result<()> {
    let result = coll.delete_one(doc!{field: value}, None).await?;
    println!("{:?}", result);
    Ok({})
}


// Function to load the MongoDB database and execute commands on it
async fn mongodb(login: &str, password: &str, db_name: &str, collection_name: &str) -> mongodb::error::Result<()> {
    let connection_url = format!("mongodb+srv://{}:{}@cluster0.cjovhvv.mongodb.net/?retryWrites=true&w=majority", login, password);
    let client_options = ClientOptions::parse(connection_url).await?;
    let client = Client::with_options(client_options)?;
    println!("Connected successfully");

    let db = client.database(db_name);
    let coll = db.collection::<User>(collection_name);


    let first_name = "Nouveau".to_string();
    let last_name = "Salaud".to_string();
    add_user(coll, first_name, last_name).await?;

    //let field = "first_name".to_string();
    //let value = "Nouveau".to_string();
    //find_user(coll, field, value).await?;
            
    //remove_user(coll, field, value).await?;
    Ok({})
}


#[tokio::main]
async fn main() {
    dotenv().expect("Failed to read .env file");
    println!("Hello, world!");
    println!("{}", env::var("MONGO_LOGIN").expect("MONGO_LOGIN not found"));

    match (env::var("MONGO_LOGIN"), env::var("MONGO_PASSWORD")) {
        (Ok(login), Ok(password)) => {

            let db_name = "Test_db";
            let collection_name = "Test_coll";

            mongodb(&login, &password, &db_name, &collection_name).await;
            println!("Finished");

        },
        _ => println!("Couldn't read env"),
    };    
}