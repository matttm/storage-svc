export const handler = async (event) => {
  const eventName = event.Records[0].eventName;
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
