# Bedal

A Lightweight, simple efficient interface for Amazon's [DynamoDB](http://aws.amazon.com/dynamodb/) for batch operations :

1.  Batch Write / Update
2.  Batch delete

[![Edit gallant-bhabha-xofi6](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/gallant-bhabha-xofi6?fontsize=14&hidenavigation=1&theme=dark)

## [](https://github.com/pynamodb/PynamoDB#installation)Installation

From NPM:

    npm  install --save badel

From YARN:

    yarn  add badel

## [](https://github.com/pynamodb/PynamoDB#basic-usage)Basic Usage

First, init your DynamoDB connection and table specifications :

    const { Bedal } =  require("bedal");
    const data =  require("./data.json");

    Bedal.init({
    	IdentityPoolId:  "******",
    	DynamoDBRegion:  "******",
    	Table:  "*******",
    	Key: {
    		PrimaryKey: { name:  "*****", type:  "S" },
    		SortKey: { name:  "******", type:  "S" }
    	}
    });

| Argument       | types  | required | Description                                                                                                                                         |
| -------------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| IdentityPoolId | string | yes      | an identity Pool Id which have the permissions to read/write/delete on the table you will use                                                       |
| DynamoDBRegion | string | yes      | the region where your table is [https://docs.aws.amazon.com/general/latest/gr/rande.html](https://docs.aws.amazon.com/general/latest/gr/rande.html) |
| Table          | string | yes      | your table name                                                                                                                                     |
| Key            | Object | yes      | describes your table key partition key and sort key if there is one.                                                                                |

### Add / Update Operation

Actually, we implement a sync like algorithm, witch will basically sync the data with DynamoDB, so if a row doesn't exist it will create it, in other case it will update it.

    const onAdd = payload => {
        console.log(payload);
    };

    Bedal.sync(data, {}, onAdd).then(data => console.log(data));

### Delete Operation

    const  onDelete  = payload => {
        console.log(payload);
    };

    Bedal.delete({ database:  "******" }, onDelete).then(data => {});

### Comming Soon Features

- [x] Batch Add / Update
- [x] Batch delete
- [ ] test
- [ ] Performance and insight report
- [ ] Documentation
- [ ] CSV support for add operations
- [ ] Better Readme and fix the spelling errors :)
- [ ] Create a dedicated website
- [ ] Create a slack and provide free support
- [ ] Codes & Algorithmes optimisation
- [ ] Writing contributing guidelines
- [ ] Pull request template
- [ ] Issue templates

feel free to ask for any feature or report a bug buy adding a new issue [add new issue ](https://github.com/Temkit/react-hook-tree/issues/new)

### License

Copyright (c) 2020 **Temkit Sidali**.

Licensed under the MIT license.

> Written with [StackEdit](https://stackedit.io/).
