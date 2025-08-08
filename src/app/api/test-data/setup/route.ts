// Temporarily disabled due to schema changes
export async function POST() {
  return new Response(JSON.stringify({ message: 'Test data setup temporarily disabled' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
} 
