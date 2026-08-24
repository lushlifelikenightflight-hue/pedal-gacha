const worker = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || request.method !== "GET") return response;

    const accept = request.headers.get("accept") ?? "";
    if (!accept.includes("text/html")) return response;

    return env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
  },
};

export default worker;