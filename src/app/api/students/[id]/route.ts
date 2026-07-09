import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, name, age, avatar, notes, joinedAt, xp } = await req.json();
    const { rows } = await pool.query(
      "UPDATE students SET name = $1, age = $2, avatar = $3, notes = $4, joined_at = $5, xp = COALESCE($6, xp) WHERE id = $7 RETURNING *",
      [name, age ?? null, avatar || "avatar-leaf", notes || null, joinedAt || new Date().toISOString().split("T")[0], typeof xp === "number" ? xp : null, id]
    );
    if (rows.length === 0)
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("PUT /api/students/[id] error:", err);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    await pool.query("DELETE FROM students WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/students/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}
