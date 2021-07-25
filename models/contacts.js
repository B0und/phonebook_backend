const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ps8p8.mongodb.net/phonebook?retryWrites=true&w=majority`

console.log("connecting to", url);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

function phoneLengthValidator(val) {
  const numberOfDigits = (val.match(/\d/g) || []).length;
  return numberOfDigits > 8;
}

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    unique: true,
  },
  number: {
    type: String,
    validate: phoneLengthValidator,
    required: true,
  },
});

phonebookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

phonebookSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Contact", phonebookSchema);
