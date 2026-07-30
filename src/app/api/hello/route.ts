export async function GET() {
  return Response.json({
    message: "Hello World",
    project: "kurs-agent",
    language: "az",
  });
}