import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST() {
  try {
    await connectDB();

    const user = await User.create({
      name: "Admin Test",
      email: "admin-test@lms.local",
      password: "temporary-password",
      role: "admin",
      status: "active",
    });

    return Response.json({
      success: true,
      message: "User berhasil dibuat",
      user,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Gagal membuat user",
      },
      { status: 500 }
    );
  }
}