let AWS = require("aws-sdk");

const { Observable } = require("rxjs");
const {
  map,
  retryWhen,
  flatMap,
  takeWhile,
  filter,
  switchMap
} = require("rxjs/operators");

DATABASE = "creances";
output = [];

let params = {
  RequestItems: {
    krdistrimed: []
  }
};

getAll({
  TableName: "krdistrimed",
  KeyConditionExpression: "#database = :database",
  ExpressionAttributeNames: {
    "#database": "database"
  },
  ExpressionAttributeValues: {
    ":database": {
      S: DATABASE
    }
  }
}).subscribe(data => {
  //console.log(data);
  output = data.Items;
  let j = 0;
  doDelete(j, 24);
});

function doDelete(j, max) {
  del(j, max).subscribe(tmp => {
    j = j + 25;

    if (tmp.length > 0) {
      params.RequestItems["krdistrimed"] = tmp;
      create(params).subscribe(data => {
        if (j < this.output.length && this.output.length - j > 25) {
          doDelete(j, 24);
        } else if (j < this.output.length && this.output.length - j < 25) {
          doDelete(j, this.output.length - j - 1);
        } else {
          return false;
        }
      });
    }
  });
}

function del(j, max) {
  return new Observable(Observer => {
    let tmp = [];

    for (i = j; i <= j + max; i++) {
      if (output[i]) {
        let Item = {
          DeleteRequest: {
            Key: {
              ref: output[i].ref,
              database: {
                S: DATABASE
              }
            }
          }
        };

        console.log(Item);
        tmp.push(Item);
      }
    }
    Observer.next(tmp);
  });
}

function create(params) {
  return new Observable.create(Observer => {
    var creds = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: "eu-central-1:3491e97b-a2dd-4f2c-896e-ab8660f78f18"
    });

    AWS.config.update({
      region: "eu-central-1",
      credentials: creds,
      apiVersions: {
        dynamodb: "2012-08-10"
      }
    });

    var dynamodb = new AWS.DynamoDB({
      region: "eu-central-1"
    });

    return dynamodb.batchWriteItem(params, function(err, data) {
      if (err) {
        return Observer.error(err);
      } else {
        console.log(data);
        return Observer.next(data);
      }
    });
  });
}

function getAll(params) {
  return new Observable.create(Observer => {
    var creds = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: "eu-central-1:3491e97b-a2dd-4f2c-896e-ab8660f78f18"
    });

    AWS.config.update({
      region: "eu-central-1",
      credentials: creds,
      apiVersions: {
        dynamodb: "2012-08-10"
      }
    });

    var dynamodb = new AWS.DynamoDB({
      region: "eu-central-1"
    });

    return dynamodb.query(params, function(err, data) {
      if (err) {
        console.log(err);
        return Observer.error(err);
      } else {
        return Observer.next(data);
      }
    });
  });
}
