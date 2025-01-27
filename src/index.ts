import express from 'express';
import config from './config/config';
import sequelizeDB from './infrastructure/framework/db/sequelize';
import articleRouter from "./application/routes/articleRouter";
import commentRouter from "./application/routes/commentRouter";
import userRouter from "./application/routes/usersRouter";
import errorHandler from "./application/middleware/errorHandler";
import logger from "./infrastructure/logger/logger";


const app = express();


app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/article', articleRouter);
app.use('/api/comment', commentRouter);
app.use(errorHandler);


const PORT = config.server.port;

app.listen(PORT, async () => {
    await sequelizeDB.connect()
    logger.info(`Server running on http://localhost:${PORT}`);
});
export {app};