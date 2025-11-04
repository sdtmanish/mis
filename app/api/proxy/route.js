// app/api/proxy/route.js
export async function POST(request) {
  try {
    const body = await request.json();

    const apiResponse = await fetch('http://dolphinapi.myportal.co.in/api/EmployeeAttendanceSheet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'APIKey': 'Sdt!@#321',
      },
      body: JSON.stringify(body),
    });

    if (!apiResponse.ok) {
      return Response.json(
        { error: `Upstream API error: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();
    return Response.json(data);

  } catch (err) {
    console.error('Proxy error:', err);
    return Response.json({ error: 'Proxy request failed' }, { status: 500 });
  }
}
