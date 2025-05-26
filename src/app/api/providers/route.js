import connectToDB from "@/lib/mongodb";
import { Website } from "@/models/website";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectToDB();

    const url = new URL(req.url);

    const sortParam = url.searchParams.get("sort") || "name";
    const sort = ["name", "knownIPsCount", "knownWebsitesCount"].includes(
      sortParam
    )
      ? sortParam
      : "name";

    const orderParam = url.searchParams.get("order") || "asc";
    const order = ["asc", "desc"].includes(orderParam) ? orderParam : "asc";

    const pageParam = Number(url.searchParams.get("page") || "1");
    const page = Number.isInteger(pageParam) && pageParam >= 1 ? pageParam : 1;

    const sortQuery = {
      [sort]: order === "asc" ? 1 : -1,
    };

    const recordsPerPage = 50;
    const skip = (page - 1) * recordsPerPage;

    const hostingProviders = await Website.aggregate([
      {
        $group: {
          _id: "$hostingProvider",
          knownIPsCount: { $addToSet: "$IPAddress" },
          knownWebsitesCount: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          knownIPsCount: { $size: "$knownIPsCount" },
          knownWebsitesCount: 1,
          _id: 0,
        },
      },
    ])
      .sort(sortQuery)
      .skip(skip)
      .limit(recordsPerPage);

    const recordsCount = (await Website.distinct("hostingProvider")).length;
    const pagesCount = Math.ceil(recordsCount / recordsPerPage);

    return NextResponse.json({ hostingProviders, pagesCount }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
