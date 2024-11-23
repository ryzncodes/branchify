import { insertJson } from '@/db/database';
import { POST } from '../../app/api/deserialize/route'; // Adjust the path if necessary

jest.mock('@/db/database', () => ({
  insertJson: jest.fn(),
}));

// Create a mock request that satisfies the `Request` type
class MockRequest extends Request {
  constructor(body: unknown) {
    // Calculate content length dynamically based on the body size
    const bodyString = JSON.stringify(body);
    const contentLength = Buffer.byteLength(bodyString, 'utf8'); // Correct content length
    super('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': contentLength.toString() },
      body: bodyString,
    });
  }
}

describe('POST /api/deserialize', () => {
  it('should return a parsed JSON object for valid JSON string', async () => {
    const request = new MockRequest({ jsonString: '{"name": "John", "age": 30}' });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ name: 'John', age: 30 });
    expect(insertJson).toHaveBeenCalledWith('{"name": "John", "age": 30}');
  });

  it('should return an error if the JSON string is empty', async () => {
    const request = new MockRequest({ jsonString: '' });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('JSON string cannot be empty.');
  });

  it('should return an error if the JSON string is invalid', async () => {
    const request = new MockRequest({ jsonString: '{name: "John", age: 30}' }); // Invalid JSON

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Invalid JSON format');
  });

});
