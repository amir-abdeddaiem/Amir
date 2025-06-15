import { User } from '@/models/User';
import nodemailer from 'nodemailer';
import { connectDB } from '@/lib/db'
import { Recover } from '@/models/Recover';
import bcrypt from 'bcrypt'
export async function POST(req: Request) {
    await connectDB();
    const { email } = await req.json();

    const transporter = nodemailer.createTransport({
        host: "live.smtp.mailtrap.io",
        port: 587,
        auth: {
            user: "api",
            pass: process.env.MAILTRAP_API_TOKEN!,
        },
        secure: false,
        tls: {
            rejectUnauthorized: false,
        },
    });
    const digit = Math.floor(100000 + Math.random() * 900000);
    const userid = await User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                throw new Error("User not found");
            }
            return user._id.toString();
        })
        .catch((err) => {
            console.error("Database error:", err);
            throw new Error("Database error");
        });

    Recover.create({
        userId: userid,
        email: email,
        digits: digit,
    })
    try {
        const info = await transporter.sendMail({
            from: 'AnimalsClubs@demomailtrap.co',  // Valid from address
            to: email,      // Recipient
            subject: "Mail recover password",
            text: "No content provided",
            html:`
            <div style="max-width:600px; margin:20px auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 0 10px rgba(0,0,0,0.1);">
                <!-- Header with Animal Theme -->
                <div style="background:#4a8f29; padding:25px; text-align:center;">
                    <h1 style="color:white; margin:0; font-size:28px;">🐾 Animal Club 🐾</h1>
                    <p style="color:#e0f7d4; margin:5px 0 0; font-size:16px;">Where animal lovers unite!</p>
                </div>
                
                <!-- Email Content -->
                <div style="padding:25px;">
                    <h2 style="color:#4a8f29; margin-top:0;">Email Verification</h2>
                    <p>Hello Animal Lover,</p>
                    <p>Thank you for registering with Animal Club! To complete your registration, please verify your email address by entering the following code:</p>
                    
                    <!-- Verification Code Display -->
                    <div style="background:#f5f5f5; padding:15px; border-radius:5px; text-align:center; margin:20px 0; font-size:24px; font-weight:bold; color:#4a8f29;">
                        ${digit}
                    </div>
                    
                    <p>This code will expire in 15 minutes. If you didn't request this verification, please ignore this email.</p>
                    
                    <p style="margin-bottom:0;">Welcome to our community!<br>
                    <strong>The Animal Club Team</strong></p>
                </div>
                
                <!-- Footer -->
                <div style="background:#f5f5f5; padding:15px; text-align:center; font-size:12px; color:#777;">
                    © ${new Date().getFullYear()} Animal Club. All rights reserved.
                </div>
            </div>`,
        });

        return new Response(
            JSON.stringify({
                success: true,
                message: "Email sent",
                messageId: info.messageId,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error: any) {
        console.error("Mail error:", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message || "Unknown error",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
