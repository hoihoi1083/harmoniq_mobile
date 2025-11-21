import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
	genSuccessData,
	genUnAuthData,
	genErrorData,
} from "../utils/gen-res-data";

const resend = new Resend(process.env.RESEND_API_KEY); // Fixed typo: RESEND_API_KE -> RESEND_API_KEY


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const body = await request.json();

		// Validate required content
		if (!body.content) {
			return NextResponse.json(genErrorData("Missing email content"));
		}

		// Extract form data for better email formatting (assuming HTML contains form data)
		const emailHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>HarmoniqFengShui 用户留言</title>
                <style>
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                        line-height: 1.6; 
                        color: #333; 
                        max-width: 600px; 
                        margin: 0 auto; 
                        padding: 20px; 
                    }
                    .header { 
                        background-color: #f8f9fa; 
                        padding: 20px; 
                        border-radius: 8px; 
                        margin-bottom: 20px; 
                    }
                    .content { 
                        background-color: #ffffff; 
                        padding: 20px; 
                        border: 1px solid #e9ecef; 
                        border-radius: 8px; 
                    }
                    .footer { 
                        margin-top: 20px; 
                        padding: 15px; 
                        background-color: #f8f9fa; 
                        border-radius: 8px; 
                        font-size: 12px; 
                        color: #6c757d; 
                    }
                    .field { 
                        margin-bottom: 15px; 
                        padding: 10px; 
                        background-color: #f8f9fa; 
                        border-radius: 4px; 
                    }
                    .field-label { 
                        font-weight: bold; 
                        color: #495057; 
                    }
                    .field-value { 
                        margin-top: 5px; 
                        color: #212529; 
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2 style="margin: 0; color: #28a745;">HarmoniqFengShui 用户留言</h2>
                    <p style="margin: 5px 0 0 0; color: #6c757d;">收到来自网站联系表单的新消息</p>
                </div>
                
                <div class="content">
                    ${body.content}
                </div>
                
                <div class="footer">
                    <p>此邮件由 HarmoniqFengShui 网站联系表单自动发送</p>
                    <p>发送时间: ${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}</p>
                    <p>如需回复客户，请直接回复客户提供的邮箱地址</p>
                </div>
            </body>
            </html>
        `;

		const res = await resend.emails.send({
			from: "HarmoniqFengShui <noreply@harmoniqfengshui.com>", // Better sender format
			to: "support@harmoniqfengshui.com", // Correct support email
			subject: "🏠 HarmoniqFengShui 用户留言 - 新的客户咨询",
			html: emailHTML,
			// Add reply-to if we can extract customer email from content
			// replyTo: customerEmail, // Would need to extract this from form data
		});

		console.log("✅ Email sent successfully:", {
			id: res?.data?.id,
			to: "support@harmoniqfengshui.com",
			timestamp: new Date().toISOString(),
		});

		return NextResponse.json(
			genSuccessData({
				id: res?.data?.id,
				message: "Email sent successfully",
			})
		);
	} catch (e) {
		console.error("❌ Send mail error:", {
			error: e.message,
			stack: e.stack,
			timestamp: new Date().toISOString(),
		});

		return NextResponse.json(
			genErrorData({
				message: "Failed to send email",
				error: e.message,
				code: e.code || "EMAIL_SEND_ERROR",
			})
		);
	}
}

// Add OPTIONS handler for CORS if needed
export async function OPTIONS(request) {
	return new NextResponse(null, {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		},
	});
}
