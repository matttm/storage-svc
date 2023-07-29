const db = require("storage-db/src");

module.exports.handler = async (event) => {
  const instance = await db["createDbInstance"]();

  try {
    await instance.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  const record = event.Records[0];
  const eventName = record.eventName;
  const bucketName = record.s3.bucket.name;
  const obj = record.s3.object;
  //
  // The key will begin with the userId followed by a semicolon
  //
  // i.e. 209:test.pdf
  //        hence 209 is the user id
  //
  const userId = obj.key.split(":")[0];
  switch (eventName) {
    case "ObjectCreated:Put":
      console.log("Object stored in S3");
      await db["FileMetaInfo"].create({
        fileTypeCd: 1,
        userId,
        fileSizeKb: obj.size,
        s3BucketName: bucketName,
        s3ObjectName: obj.key,
        s3ObjectKey: obj.key,
      });
      break;
    default:
      break;
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
};
