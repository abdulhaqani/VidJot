if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI:
      'mongodb+srv://AbdulHaqani:Dudeperfect1@vidjot-prod-rcylk.mongodb.net/test?retryWrites=true',
  };
} else {
  module.exports = { mongoURI: 'mongodb://localhost/vidjot-dev' };
}
