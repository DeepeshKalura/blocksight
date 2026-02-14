// Authentication disabled for demo version
// import { handlers } from "@/lib/auth";

// export const { GET, POST } = handlers;

// Mock handlers for demo
export const GET = () => new Response(null, { status: 404 });
export const POST = () => new Response(null, { status: 404 });
