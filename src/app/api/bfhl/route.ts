import { NextResponse } from "next/server";
import mime from "mime-types";

// Helper function to check if a number is prime
const isPrime = (num: number): boolean => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { data, file_b64 } = body;

    // Validate input
    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { is_success: false, message: "Invalid input" },
        { status: 400 }
      );
    }

    const numbers: string[] = [];
    const alphabets: string[] = [];
    let highestLowercase: string | null = null;
    let isPrimeFound = false;

    // Process `data` array
    data.forEach((item: string) => {
      if (/^\d+$/.test(item)) {
        const num = parseInt(item);
        numbers.push(item);
        if (isPrime(num)) isPrimeFound = true;
      } else if (/^[a-zA-Z]$/.test(item)) {
        alphabets.push(item);
        if (item >= "a" && (!highestLowercase || item > highestLowercase)) {
          highestLowercase = item;
        }
      }
    });

    // Handle `file_b64`
    let fileValid = false;
    let fileMimeType: string | null = null;
    let fileSizeKb: number | null = null;
    
    if (file_b64) {
      try {
        // Check if the Base64 string includes a MIME prefix
        if (file_b64.includes(",")) {
          const [prefix, base64Data] = file_b64.split(",");
          const mimeMatch = prefix.match(/data:(.*?);base64/); // Extract MIME type from prefix
          fileMimeType = mimeMatch ? mimeMatch[1] : null;
    
          // Decode Base64 data
          const buffer = Buffer.from(base64Data, "base64");
    
          // Calculate file size
          fileSizeKb = Math.round(buffer.length / 1024);
    
          // Validate file based on MIME type presence
          fileValid = !!fileMimeType;
        } else {
          throw new Error("Invalid Base64 format");
        }
      } catch (error) {
        console.error("Error processing file:", error);
        fileValid = false;
      }
    }
    

    // Build the response
    return NextResponse.json({
      is_success: true,
      user_id: "manish_singh_10062003",
      email: "manishsingh13275@gmail.com",
      roll_number: "0101CS211078",
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
      is_prime_found: isPrimeFound,
      file_valid: fileValid,
      file_mime_type: fileMimeType,
      file_size_kb: fileSizeKb,
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { is_success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ operation_code: 1 });
}
