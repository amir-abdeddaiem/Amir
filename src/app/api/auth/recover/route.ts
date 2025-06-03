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
            html: `
            <div style="max-width:600px; margin:20px auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 0 10px rgba(0,0,0,0.1);">
        <!-- Header with Animal Theme -->
        <div style="background:#4a8f29; padding:25px; text-align:center;">
            <h1 style="color:white; margin:0; font-size:28px;">🐾 Animal Club 🐾</h1>
            <p style="color:#e0f7d4; margin:5px 0 0; font-size:16px;">Where animal lovers unite!</p>
        </div>
        
        <!-- Email Content -->
        <div style="padding:25px;">
            <h2 style="color:#4a8f29; margin-top:0;">Password Reset Request</h2>
            <p>Hello Animal Lover,</p>
            <p>We received a request to reset your password for your Animal Club account.</p>
            <p>Click the button below to reset your password:</p>
            <p style="font-weight:bold; color:#4a8f29;">Your Verification Digit: ${digit}</p>
            <!-- Reset Button -->
            <div style="text-align:center; margin:30px 0;">
                <a href=${"http://localhost:3000/auth/recover/" + userid} style="background-color:#4a8f29; color:white; padding:12px 25px; text-decoration:none; border-radius:5px; font-weight:bold; display:inline-block;">
                    Reset My Password
                </a>
            </div>
            
            <p>If you didn't request this password reset, please ignore this email or contact support if you have questions.</p>
            
            <p style="margin-bottom:0;">Happy adventures with your furry friends!<br>
            <strong>The Animal Club Team</strong></p>
        </div>
        
        <!-- Footer -->
       
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



export async function PUT(req: Request) {
    await connectDB();
    const { pass, userId, code } = await req.json();
    if (!userId || !pass || !code) {
        return new Response(
            JSON.stringify({ success: false, error: "Invalid request" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }
    const user = await User.findById(userId)
    const email = user?.email;
    const data : any = await Recover.findOne({ digits: code, email: email }) ;


    if (data != null) {
        if (data.digits !== code) {
              return new Response(
                    JSON.stringify({ success: false, error:"Invalid Digits" }),
                    { status: 500, headers: { "Content-Type": "application/json" } }
                );
        }
        const hashedPassword = await bcrypt.hash(pass, 10);

        return User.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true, runValidators: true }
        )
            .then((user) => {
                if (!user) {
                    throw new Error("User not found");
                }
                Recover.deleteOne({ digits: code,email:user.email })

                return new Response(

                    JSON.stringify({ success: true, message: "Password updated successfully" }),
                    { status: 200, headers: { "Content-Type": "application/json" } }
                );
            })
            .catch((error) => {
                console.error("Update error:", error);
                return new Response(
                    JSON.stringify({ success: false, error: error.message || "Failed to update password" }),
                    { status: 500, headers: { "Content-Type": "application/json" } }
                );
            });
    }

    return new Response(
        JSON.stringify({ success: false, error: "Invalid userId or digits" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
    );

}