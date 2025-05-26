import connectToDB from "@/lib/mongodb";
import { Purchase } from "@/models/purchase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDB();

    const data = await req.json();
    data.submittedAt = new Date().toISOString();

    await new Purchase(data).save();

    return NextResponse.json(
      { message: "Record created successfully" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create record" },
      { status: 500 }
    );
  }
}
