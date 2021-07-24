const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://unbound-mda:${password}@cluster0.ps8p8.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", phonebookSchema);


if (process.argv.length === 5) {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
  });

  contact.save().then((result) => {
    console.log("contact saved!");
    mongoose.connection.close();
  });
}

if (process.argv.length === 3) {
  console.log("phonebook:");

  Contact.find({}).then((result) => {
    result.forEach((contact) => {
      console.log(`${contact.name} ${contact.number}`);
    });
    mongoose.connection.close();
  });
}
