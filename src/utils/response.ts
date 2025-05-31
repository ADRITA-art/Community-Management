export function sendJSON(status: number, success: boolean, content: any) {
  return new Response(
    JSON.stringify({
      status: success,
      content,
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
