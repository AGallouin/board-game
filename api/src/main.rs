use std::env;
use dotenv::dotenv;
use mongodb::{options::ClientOptions, Client};

[tokio::mongodb]
async fn mongodb() -> mongodb::error::Result<()> {
    let connectionUrl: String = format!("mongodb+srv://{}:{}@cluster0.cjovhvv.mongodb.net/?retryWrites=true&w=majority", login, password);
    println!("{}", connectionUrl);

    let client_options = ClientOptions::parse(connectionUrl).await?;
    let client = Client::with_options(client_options)?;
    let database = client.database("testDB");
    Ok(())
}

fn main() {
    dotenv().expect("Failed to read .env file");
    println!("Hello, world!");
    println!("{}", env::var("MONGO_LOGIN").expect("MONGO_LOGIN not found"));

    match (env::var("MONGO_LOGIN"), env::var("MONGO_PASSWORD")) {
        (Ok(login), Ok(password)) => {
            mongoDB(login, password);
            println!("{}:{}", login, password);
        },
        _ => println!("Couldn't read env"),
    };    
}

