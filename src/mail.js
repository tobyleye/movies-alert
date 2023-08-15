import nodemailer from "nodemailer";
import { mailConfig } from "./config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mailConfig.user,
    pass: mailConfig.pass,
  },
});

export const sendWeeklyNotification = async (user, movies) => {
  let movieListHtml = movies
    .map((movie) => {
      let { title, synopsis, link } = movie;
      return `
            <div>
                <h2>${title}</h2>
                <p>${synopsis}</p>
                <a href="${link}">download here</a>
            </div>
            <hr/>
        `;
    })
    .join("\n");

  let html = `
    <div>
        <h1>Hi ${user.name}, these are your weekly movies we promised you</h1>
        ${movieListHtml}
    </div>
    `;

  let mailOptions = {
    from: "movies-alert@gmail.com",
    to: "krisella74@gmail.com",
    subject: "Your weekly top movies",
    html,
  };
  await transporter.sendMail(mailOptions);
};
