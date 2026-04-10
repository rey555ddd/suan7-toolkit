const allowedOrigins = [
  'https://suan7.reyway.com',
  'https://eagle.reyway.com',
  'https://cleanclean.reyway.com',
  'https://club.reyway.com',
  'http://localhost:5173',
];

export const onRequest: PagesFunction = async (context) => {
  const origin = context.request.headers.get('Origin') || '';
  const isAllowed = allowedOrigins.includes(origin);

  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': isAllowed ? origin : '',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const response = await context.next();
  const newResponse = new Response(response.body, response);
  if (isAllowed) {
    newResponse.headers.set('Access-Control-Allow-Origin', origin);
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  return newResponse;
};
