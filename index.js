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

  Contact.findOneAndUpdate(
    { name: contact.name },
    { number: contact.number },
    { upsert: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return response.send("Succesfully saved.");
    }
  ).catch((error) => next(error));
});

app.get(
  ["/api/persons/:id", "/api/contacts/:id"],
  (request, response, next) => {
    Contact.findById(request.params.id)
      .then((contact) => {
        if (contact) {
          response.json(contact);
        } else {
          response.status(404).end();
        }
      })
      .catch((error) => next(error));
  }
);

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



const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};
// handler of requests with result to errors
app.use(errorHandler);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});