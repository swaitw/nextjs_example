import { http } from "msw"; // ✅ Use "http" instead of "rest"

export const handlers = [


  http.post("/api/account/create", async ({ request }) => {
    const data = await request.json();
    return new Response(
      JSON.stringify({ message: "Mocked Data Received", data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }),
];