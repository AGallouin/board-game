/* struct AuthenticatedUser {
    user_id: i32
}

/* Login info for any user who wants to access the Front end App */
#[derive(FromForm, Deserialize, Debug)]
pub struct AppAuthInfo {
    pub login: String,
    pub password: String,
}


#[derive(Debug)]
enum LoginError {
    InvalidData,
    UsernameDoesNotExist,
    WrongPassword
}


impl<'a, 'r> FromRequest<'a, 'r> for AuthenticatedUser {
    type Error = LoginError;
    fn from_request(request: &'a Request<'r>)
      -> Outcome<AuthenticatedUser, LoginError> {
        let username = request.headers().get_one("username");
        let password = request.headers().get_one("password");
        match (username, password) {
            (Some(u), Some(p)) => {
                ...
            }
            _ => Outcome::Failure(
                (Status::BadRequest,
                 LoginError::InvalidData))
        }
    }
} */