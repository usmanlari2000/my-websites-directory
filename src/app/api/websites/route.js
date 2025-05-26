import connectToDB from "@/lib/mongodb";
import { Website } from "@/models/website";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectToDB();

    const url = new URL(req.url);

    const filterParam = url.searchParams.get("filter");
    let filter = [];

    try {
      if (
        typeof filterParam === "string" &&
        /^\[\s*(?:"[^"]*"\s*,\s*)*"[^"]*"\s*\]$/.test(filterParam)
      ) {
        filter = JSON.parse(filterParam);
      }
    } catch {
      filter = [];
    }

    const sortParam = url.searchParams.get("sort") || "globalRanking";
    const sort = [
      "domainName",
      "IPAddress",
      "hostingProvider",
      "globalRanking",
    ].includes(sortParam)
      ? sortParam
      : "globalRanking";

    const orderParam = url.searchParams.get("order") || "asc";
    const order = ["asc", "desc"].includes(orderParam) ? orderParam : "asc";

    const pageParam = Number(url.searchParams.get("page") || "1");
    const page = Number.isInteger(pageParam) && pageParam >= 1 ? pageParam : 1;

    const filterQuery = filter.length
      ? { hostingProvider: { $in: filter } }
      : {};

    const sortQuery = {
      [sort]: order === "asc" ? 1 : -1,
    };

    const recordsPerPage = 50;
    const skip = (page - 1) * recordsPerPage;

    const websites = await Website.find(filterQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(recordsPerPage);

    const recordsCount = await Website.countDocuments(filterQuery);
    const pagesCount = Math.ceil(recordsCount / recordsPerPage);

    return NextResponse.json({ websites, pagesCount }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
