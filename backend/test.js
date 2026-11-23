require("dotenv").config();
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
    const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: "alwaysbusy0001@gmail.com",
        subject: "ILoveStudy Email Test",
        html: "<h2>Welcome to ILoveStudy!</h2><p>Email service is working.</p>"
    });

    if (error) {
        console.error(error);
        return;
    }

    console.log("Email sent:", data);
}
sendTestEmail();