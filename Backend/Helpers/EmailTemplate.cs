
namespace Backend.Helpers
{
    public class EmailTemplate
    {
        public string ReplacePlaceholders(string template, string recipientName, string confirmationToken)
        {
            // Replace placeholders in the HTML template
            template = template.Replace("{{RecipientName}}", recipientName);
            template = template.Replace("{{ConfirmationToken}}", confirmationToken);

            return template;
        }

        public string GetEmailConfirmationTemplate(string recipientName, string confirmationToken)
        {
            string template = @"
                    <!DOCTYPE HTML PUBLIC ""-//W3C//DTD XHTML 1.0 Transitional //EN"" ""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"">
                    <html xmlns=""http://www.w3.org/1999/xhtml"" xmlns:v=""urn:schemas-microsoft-com:vml"" xmlns:o=""urn:schemas-microsoft-com:office:office"">
                    <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f1f1f1;
                        }

                        p {
                            font-size: 16px;
                            color: #333;
                        }

                        a {
                            text-decoration: none;
                            background-color: #30e3ca;
                            color: #fff;
                            padding: 10px 15px;
                            border-radius: 5px;
                        }
                    </style>
                    </head>
                    <body>
                    <p>Hi {{RecipientName}},</p>
                    <p>Click the following link to confirm your email:</p>
                    <a href=""http://localhost:5173/verify-account?token=" + confirmationToken + @""">Confirm Email</a>
                    </body>
                    </html>
                    ";
            // Replace placeholders with actual values
            return ReplacePlaceholders(template, recipientName, confirmationToken);
        }

        public string GetEmailChangeConfirmationTemplate(string recipientName, string confirmationToken)
        {
            string template = @"
                    <!DOCTYPE HTML PUBLIC ""-//W3C//DTD XHTML 1.0 Transitional //EN"" ""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"">
                    <html xmlns=""http://www.w3.org/1999/xhtml"" xmlns:v=""urn:schemas-microsoft-com:vml"" xmlns:o=""urn:schemas-microsoft-com:office:office"">
                    <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f1f1f1;
                        }

                        p {
                            font-size: 16px;
                            color: #333;
                        }

                        a {
                            text-decoration: none;
                            background-color: #30e3ca;
                            color: #fff;
                            padding: 10px 15px;
                            border-radius: 5px;
                        }
                    </style>
                    </head>
                    <body>
                    <p>Hi {{RecipientName}},</p>
                    <p>Click the following link to confirm your email:</p>
                    <a href=""http://localhost:5173/confirm-update-email?token=" + confirmationToken + @""">Confirm Email</a>
                    </body>
                    </html>
                    ";

            // Replace placeholders with actual values
            return ReplacePlaceholders(template, recipientName, confirmationToken);
        }

        public string GetEmailResetPasswordTemplate(string recipientName, string confirmationToken)
        {
            string template = @"
                            <!DOCTYPE HTML PUBLIC ""-//W3C//DTD XHTML 1.0 Transitional //EN""
                            ""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"">
                            <html xmlns=""http://www.w3.org/1999/xhtml"" xmlns:v=""urn:schemas-microsoft-com:vml"" xmlns:o=""urn:schemas-microsoft-com:office:office"">
                            <head>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f1f1f1;
                                }

                                p {
                                    font-size: 16px;
                                    color: #333;
                                }

                                a {
                                    text-decoration: none;
                                    background-color: #980ea8;
                                    color: #fff;
                                    padding: 10px 15px;
                                    border-radius: 5px;
                                }

                                /* Style for confirmation token and copy button */
                                #confirmationTokenContainer {
                                    display: flex;
                                    align-items: center;
                                    width: fit-content;
                                }

                                #confirmationToken {
                                    font-size: 20px;
                                    background-color: #f3f3f3;
                                    padding: 10px;
                                    border: 1px solid #ccc;
                                    border-radius: 5px;
                                    margin-right: 10px;
                                    flex-grow: 1;
                                }

                                #resetLink {
                                    background-color: #b2186f;
                                    color: #fff;
                                    border: none;
                                    padding: 10px 15px;
                                    border-radius: 5px;
                                    cursor: pointer;
                                }
                            </style>
                            </head>
                            <body>
                            <p>Hi {{RecipientName}},</p>
                            <p>This is your token for resetting your password:</p>
                            <div id=""confirmationTokenContainer"">
                                <p id=""confirmationToken"">{{ConfirmationToken}}</p>
                            </div>
                            <div>
                                <a href=""http://localhost:5173/reset-password"" target=""_blank"">Reset your password</a>
                            </div>
                            </body>
                            </html>
                            ";

            // Replace placeholders with actual values
            return ReplacePlaceholders(template, recipientName, confirmationToken);
        }


        public string GetEmailDeleteAccountTemplate(string recipientName, string deletionToken)
        {
            string template = @"
                    <!DOCTYPE HTML PUBLIC ""-//W3C//DTD XHTML 1.0 Transitional //EN""
                    ""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"">
                    <html xmlns=""http://www.w3.org/1999/xhtml"" xmlns:v=""urn:schemas-microsoft-com:vml"" xmlns:o=""urn:schemas-microsoft-com:office:office"">
                    <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f1f1f1;
                        }

                        p {
                            font-size: 16px;
                            color: #333;
                        }

                        a {
                            text-decoration: none;
                            background-color: #980ea8;
                            color: #fff;
                            padding: 10px 15px;
                            border-radius: 5px;
                        }

                        /* Style for confirmation token and copy button */
                        #confirmationTokenContainer {
                            display: flex;
                            align-items: center;
                            width: fit-content;
                        }

                        #confirmationToken {
                            font-size: 20px;
                            background-color: #f3f3f3;
                            padding: 10px;
                            border: 1px solid #ccc;
                            border-radius: 5px;
                            margin-right: 10px;
                            flex-grow: 1;
                        }

                        #resetLink {
                            background-color: #b2186f;
                            color: #fff;
                            border: none;
                            padding: 10px 15px;
                            border-radius: 5px;
                            cursor: pointer;
                        }
                    </style>
                    </head>
                    <body>
                    <p>Hi {{RecipientName}},</p>
                    <p>This is your token for deleting your account:</p>
                    <div id=""confirmationTokenContainer"">
                        <p id=""deletionToken"">" + deletionToken + @"</p>
                    </div>
                    <div>
                        <a href=""http://localhost:5173/delete-account"" target=""_blank"">Delete account</a>
                    </div>
                    </body>
                    </html>
                    ";

            // Replace placeholders with actual values
            return ReplacePlaceholders(template, recipientName, deletionToken);
        }




    }
}