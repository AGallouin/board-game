use std::env;
use dotenv::dotenv;
use mongodb::{options::ClientOptions, Client};

async fn mongodb(login: &String, password: &String) -> mongodb::error::Result<()> {
    println!("totototo");
    let connection_url = format!("mongodb+srv://{}:{}@cluster0.cjovhvv.mongodb.net/?retryWrites=true&w=majority", login, password);
    println!("{}", connection_url);
    
    let client_options = ClientOptions::parse(connection_url).await?;
    let client = Client::with_options(client_options)?;
    let database = client.database("testDB");
    Ok(())
}

#[tokio::main]
async fn main() {
    dotenv().expect("Failed to read .env file");
    println!("Hello, world!");
    println!("{}", env::var("MONGO_LOGIN").expect("MONGO_LOGIN not found"));

    match (env::var("MONGO_LOGIN"), env::var("MONGO_PASSWORD")) {
        (Ok(login), Ok(password)) => {
            mongodb(&login, &password).await;
            println!("{}:{}", login, password);
        },
        _ => println!("Couldn't read env"),
    };    
}

