import app from './app';

const { PORT = 8000 } = process.env;

app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
