let pdf = require("pdf-creator-node");
const generateTranscript = (transcript) => {
  let htmlContent = `<!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 14px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .header img {
            width: 150px;
            height: 50px;
          }
          .content {
            margin-bottom: 30px;
          }
          .content p {
            text-indent: 20px;
            margin: 10px 0;
          }
          .content img {
            float: right;
            width: 150px;
            height: 50px;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="data:image/png;base64, ${transcript.photob64}" alt="Logo">
          <h2>Name and Address</h2>
        </div>
        <hr>

        <div class="content">
          <p>${transcript.certificateDetail.department}${transcript.certificateDetail.fname}${transcript.certificateDetail.address}${transcript.certificateDetail.dob}${transcript.certificateDetail.stayDate}${transcript.certificateDetail.semester}${transcript.certificateDetail.year}Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor enim in justo vestibulum vehicula. Nam fermentum bibendum eros, at convallis nibh molestie id. Quisque vel tortor sed sapien convallis rutrum. Suspendisse tincidunt sed nisi vel pharetra. Vestibulum posuere luctus nisl, in euismod nulla vestibulum ac.</p>
          <img src="data:image/png;base64, ${transcript.signImages[0]}" alt="Signature">
        </div>
        <hr>
        <div class="content">
          <p>Phasellus bibendum nulla mi, non gravida orci dictum nec. Aenean hendrerit, nulla ut pharetra dictum, purus velit efficitur velit, nec congue quam purus id justo. Fusce pulvinar vel eros vel fringilla.</p>
          <img src="data:image/png;base64, ${transcript.signImages[1]}" alt="Signature">
        </div>
        <hr>
        <div class="content">
          <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nunc ut ipsum in ex vestibulum egestas. Proin imperdiet velit vel augue eleifend blandit. Curabitur tristique, ipsum in varius lobortis, turpis magna tincidunt eros, vitae blandit ante ante eget justo.</p>
          <img src="data:image/png;base64, ${transcript.signImages[2]}" alt="Signature">
        </div>
        <hr>
        <div class="content">
          <p>Mauris in sapien vel ipsum tincidunt auctor. Fusce sed enim quis justo interdum rutrum vel nec augue. Fusce nec tortor a quam vehicula euismod.</p>
          <img src="data:image/png;base64, ${transcript.signImages[3]}" alt="Signature">
        </div>
        <hr>
        <div class="footer">
          <img src="https://example.com/passport_photo.png" alt="Passport Photo">
          <img src="https://example.com/signature5.png" alt="Signature">
        </div>
      </body>
    </html>
    `;
  let options = {
    format: "A4",
    orientation: "portrait",
    border: "5mm",
  };
  let users = [
    {
      name: "Shyam",
      age: "26",
    },
    {
      name: "Navjot",
      age: "26",
    },
    {
      name: "Vitthal",
      age: "26",
    },
  ];
  let document = {
    html: htmlContent,
    path: transcript.fileLocation,
    data: {
      users: users,
    },
    type: "",
  };
  pdf
    .create(document, options)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
};
module.exports = { generateTranscript };
