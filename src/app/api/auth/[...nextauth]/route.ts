import { handlers } from "@/auth"; // Referring to the auth.ts we just created
import type { NextRequest } from "next/server";

// NextAuth requires dynamic rendering, not static
export const dynamic = "force-dynamic";

// Export the handlers directly - NextAuth 5 handles binding correctly
export const { GET, POST } = handlers;
