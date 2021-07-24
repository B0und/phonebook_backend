require("dotenv").config();
var morgan = require("morgan");
const express = require("express");
const cors = require("cors");

const Contact = require("./models/contacts");

const app = express();
app.use(cors());
app.use(express.static("build"));

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
  )
);

app.use(express.json());

app.get(["/api/persons", "/api/contacts"], (request, response) => {
  Contact.find({}).then((contact) => {
    response.json(contact);
  });
});

app.post(["/api/persons", "/api/contacts"], (request, response) => {
  console.log(request.body);

  const body = request.body;
  console.log(body);

  // body must have name and number params
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact.save().then((new_contact) => {
    console.log("contact saved!");
    response.json(new_contact);
  });
});

app.get(["/api/persons/:id", "/api/contacts/:id"], (request, response) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      response.json(contact);
    })
    .catch((error) => {
      response.status(404).end();
    });
});

app.delete(["/api/persons/:id", "/api/contacts/:id"], (request, response) => {
  Contact.findByIdAndDelete({ _id: request.params.id }, function (err) {
    if (!err) {
      response.status(204).end();
    } else {
      response.status(404).end();
    }
  });
});

app.get("/info", (request, response) => {
  Contact.find({}).then((contact) => {
    const message = `Phonebook has info for ${contact.length} people`;
    response.send(`<p>${message}</p> <p>${new Date()}</p> `);
  });


});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
