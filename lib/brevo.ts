export async function sendBrevoEmail(toEmail: string, toName: string, subject: string, htmlContent: string) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("BREVO_API_KEY is not defined");
    return { success: false, error: "API key missing" };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Octopus Gifts", email: "hello@octopusperfume.in" },
        to: [{ email: toEmail, name: toName || "Beautiful" }],
        subject: subject,
        htmlContent: htmlContent,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Brevo API error:", data);
      return { success: false, error: data.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send Brevo email:", error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmation(orderId: string, customerName: string, customerEmail: string, totalAmount: string | number, productInfo: string) {
  if (!customerEmail || customerEmail === "N/A") return { success: false, error: "No email provided" };

  const itemsHtml = `
    <tr>
      <td style="padding: 15px 0; border-bottom: 1px solid #f0eaeb;">
        <strong style="color: #1a1a1a;">${productInfo}</strong><br/>
      </td>
      <td style="padding: 15px 0; border-bottom: 1px solid #f0eaeb; text-align: right; color: #1a1a1a;">
        -
      </td>
    </tr>
  `;

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FDF8F5; padding: 40px 20px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #800020; font-family: Georgia, serif; font-size: 32px; margin: 0;">Octopus Gifts</h1>
      </div>
      
      <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
        <p style="font-size: 18px; color: #333; margin-top: 0;">Hey ${customerName},</p>
        <p style="font-size: 16px; color: #444; line-height: 1.6;">
          Your beautiful jewelry is confirmed! We are absolutely thrilled to pack this for you. 
          Our artisans are already preparing your order <strong>#${orderId.slice(0, 8)}</strong> with the utmost care and love.
        </p>
        
        <div style="margin: 35px 0; border-top: 2px dashed #f0eaeb;"></div>
        
        <h3 style="color: #800020; font-family: Georgia, serif; font-size: 20px; margin-bottom: 20px;">What's in the box?</h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
          <tr>
            <td style="padding-top: 20px;">
              <strong style="color: #800020; font-size: 18px;">Total</strong>
            </td>
            <td style="padding-top: 20px; text-align: right;">
              <strong style="color: #800020; font-size: 18px;">₹${totalAmount}</strong>
            </td>
          </tr>
        </table>
        
        <div style="margin: 35px 0; border-top: 2px dashed #f0eaeb;"></div>
        
        <p style="font-size: 16px; color: #444; line-height: 1.6;">
          We will send you another update the moment your package leaves our studio. 
          If you have any questions or just want to say hi, simply reply to this email!
        </p>
        
        <p style="font-size: 16px; color: #444; margin-bottom: 0;">
          With love,<br/>
          <strong>The Octopus Gifts Team</strong>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #888; font-size: 12px;">
        <p>Crafted with care to be everlasting.</p>
        <p>© ${new Date().getFullYear()} Octopus Gifts. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendBrevoEmail(customerEmail, customerName, "🎁 Your Octopus Gifts order is confirmed!", htmlContent);
}

export async function sendAbandonedCartReminder(order: any) {
  const customerName = order.name || order.shippingDetails?.name || "there";
  const customerEmail = order.email || order.shippingDetails?.email;
  const orderId = order.orderId || order.id;
  
  if (!customerEmail) return { success: false, error: "No email provided" };

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FDF8F5; padding: 40px 20px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #800020; font-family: Georgia, serif; font-size: 32px; margin: 0;">Octopus Gifts</h1>
      </div>
      
      <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
        <p style="font-size: 18px; color: #333; margin-top: 0;">Hey ${customerName},</p>
        <p style="font-size: 16px; color: #444; line-height: 1.6;">
          We noticed you left something absolutely beautiful behind in your cart. 
          Our artisans were just getting ready to craft it for you!
        </p>
        <p style="font-size: 16px; color: #444; line-height: 1.6;">
          These pieces are selling out fast, and we wouldn't want you to miss out on the perfect gift. 
          Let's get this shipped to you!
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://octopusperfume.in/checkout" style="background-color: #800020; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; letter-spacing: 1px; display: inline-block;">
            COMPLETE MY ORDER
          </a>
        </div>
        
        <p style="font-size: 15px; color: #666; text-align: center; font-style: italic;">
          (Psst... if you need any help, just reply directly to this email!)
        </p>
        
        <div style="margin: 35px 0; border-top: 2px dashed #f0eaeb;"></div>
        
        <p style="font-size: 16px; color: #444; margin-bottom: 0;">
          With love,<br/>
          <strong>The Octopus Gifts Team</strong>
        </p>
      </div>
    </div>
  `;

  return sendBrevoEmail(customerEmail, customerName, "You left something beautiful behind ✨", htmlContent);
}
