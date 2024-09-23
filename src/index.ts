import express, { Request, Response } from 'express';
import startMongo from './config/database';
import usersRouter from './routes/users/users';
import productsRouter from './routes/products/products';
import ordersRouter from './routes/orders/orders';
const cors = require("cors");
import dotenv from 'dotenv';

dotenv.config();

startMongo();

const app = express();
const port = process.env.BACKEND_PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);
// app.use("/products/", productsRouter);
// app.use("/orders/", ordersRouter);

app.use("/", (req: Request, res: Response) => {
  res.send("<h1>It's running</h1>");
});

app.listen(port,  () => console.log("success, port: ", port));