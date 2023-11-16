const express = require('express');
const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/users')
const expenseRoutes = require('./routes/expense');
const User = require('./models/users')
const Expense = require('./models/expense');
const Order = require('./models/orders');
const premiumRoutes = require('./routes/purchase');
const premiumFeatureRoute = require('./routes/premiumFeature');
const passwordRoutes = require('./routes/resetPassword');
const Forgotpassword = require('./models/forgotPassword');
const DownloadedFiles = require('./models/downloadedFiles');
require('dotenv').config();
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log',), { flags: 'a' });

app.use(bodyParser.json({ extended: false}));
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false,}));
app.use(morgan('combined', { stream: accessLogStream })); 

app.use('/users',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase', premiumRoutes);
app.use('/premium', premiumFeatureRoute);
app.use('/password', passwordRoutes);

app.use((req, res) => {
    res.sendFile(path.join(__dirname, `views/${req.url}`))
})


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(DownloadedFiles);
DownloadedFiles.belongsTo(User);

sequelize.sync() 
    .then(() => {
        app.listen(3000);
        console.log('successful');
    })
    .catch((err) => {
        console.log(err);
    });
   