import nodemailer from 'nodemailer'

const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  from: string = process.env.EMAIL_FROM as string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST as string,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASS as string,
    },
  })

  await transporter.sendMail({ from, to, subject, html })
}

export { sendEmail }
