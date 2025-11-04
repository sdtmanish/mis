// app/api/login/route.js

export async function POST(request) {
  try {
    const body = await request.json();

    // Forward the request to your actual API
    const apiResponse = await fetch('http://apidol.myportal.co.in/api/LoginUserWeb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'APIKey': 'Sdt!@#321',
      },
      body: JSON.stringify({
        LoginName: body.LoginName,
        Password: body.Password,
      }),
    });

    // If API fails, return a readable error
    if (!apiResponse.ok) {
      return Response.json(
        { error: `Upstream API error: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();
    return Response.json(data);

  } catch (error) {
    console.error('Login Proxy Error:', error);
    return Response.json(
      { error: 'Proxy request failed' },
      { status: 500 }
    );
  }
}
