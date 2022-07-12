use std::env;
extern crate dotenv;

fn main() {
    dotenv::dotenv().expect("Failed to read .env file");
    println!("Hello, world!");
    println!("{}", env::var("MONGO_LOGIN").expect("MONGO_LOGIN not found"));
}
