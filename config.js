

module.exports.config = {
    "LOCAL": {
      "JWT_secret":"HelloSecret",
      "REFRESH_TOKEN_SECRET":"HelloSecret1",
      "dataBase": {
        "dbConnectionString": "mongodb://localhost:27017/JWTAuth"
      }
    },
    "DEV":{
      "JWT_secret":"HelloSecret",
      "REFRESH_TOKEN_SECRET":"HelloSecret1",
      "dataBase": {
        "dbConnectionString": "mongodb://localhost:27017/JWTAuth"
      }
    }
  }