import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db("logixman");
    const result = await db
      .collection("freight-enquiries")
      .insertOne({ ...data, createdAt: Date.now(), read: false });

    console.log(result);
    return NextResponse.json("success", { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json("failed", { status: 404 });
  }
}

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("logixman");
    const result = await db.collection("freight-enquiries").find().toArray();
    console.log(result);
    const transformedData = result.map((item) => {
      const name = item.name;
      const phone = item.phone;
      const email = item.email;
      const weight = `${parseFloat(item.weight)} Kg`;
      const volume = `${
        (parseFloat(item.length) *
          parseFloat(item.width) *
          parseFloat(item.height)) /
        1000
      } L`;
      const country = `Country from ${item.selectedExport} to ${item.selectedImport}`;
      const time = new Date(item.createdAt).toLocaleString();
      const read = [item.read, item._id];

      return {
        name,
        phone,
        email,
        weight,
        volume,
        country,
        time,
        read,
      };
    });

    return NextResponse.json(transformedData, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json("failed", { status: 404 });
  }
}
