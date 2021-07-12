const { response, json } = require("express");
const express = require("express");
const app = express();
app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.post("/api/persons", (request, response) => {
  console.log(request.body); 

  const body = request.body;
  console.log(body);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const randomId = Math.floor(
    Math.random() * (100000000000000000 - 10 + 1) + 10
  );

  const person = {
    content: body.content,
    id: randomId,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = persons.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const previousLength = persons.length;
  persons = persons.filter((note) => note.id !== id);
  const newLength = persons.length;
  if (previousLength === newLength) {
    response.status(404).end();
  } else {
    response.status(204).end();
  }
});

app.get("/info", (request, response) => {
  const message = `Phonebook has info for ${persons.length} people`;
  response.send(`<p>${message}</p> <p>${new Date()}</p> `);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
