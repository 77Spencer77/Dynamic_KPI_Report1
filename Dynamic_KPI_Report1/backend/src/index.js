import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import customerRoutes from './routes/customerRoutes.js';
import defectRoutes from './routes/defectRoutes.js';
import securityRoutes from './routes/securityRoutes.js';
import cirsRoutes from './routes/cirsRoutes.js';
import regressionRoutes from './routes/regressionRoutes.js';

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/customer', customerRoutes);
app.use('/defect', defectRoutes);
app.use('/security', securityRoutes);
app.use('/cirs', cirsRoutes);
app.use('/regression', regressionRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
