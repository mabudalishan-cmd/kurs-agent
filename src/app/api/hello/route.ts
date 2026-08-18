export async function GET() {
  return Response.json({
    message: "Hello World",
    project: "helloworld",
    language: "az",
  });
}