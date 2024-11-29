
function VerificationEmailTemplate(name, verificationLink) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            image-logo {
                max-width: 90px;
                width: 7%;
                height: auto;
            }
            .content {
                margin: 20px 0;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007BFF;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #777;
            }
            /* Responsive Styles */
            @media only screen and (max-width: 600px) {
                .container {
                    padding: 10px;
                }
                .button {
                    width: 100%;
                    text-align: center;
                }
                image-logo {
                    max-width: 120px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="${process.env.FRONTEND_URL}admin/assets/img/logo.png" class= "image-logo" alt="Company Logo" />
            </div>
            <div class="content">
                <h2>Hello ${name},</h2>
                <p>Thank you for registering with us. Please verify your email address by clicking the button below:</p>
                <a href="${verificationLink}" class="button">Verify Email</a>
            </div>
            <div class="footer">
                <p>If you did not create an account, no further action is required.</p>
                <p>Thank you!</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

module.exports = { VerificationEmailTemplate };