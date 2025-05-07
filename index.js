const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const scheduleRoute = require('./routes/scheduleEmail');
const { agenda } = require('./jobs/agenda');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/schedule-email', scheduleRoute);

const PORT = 5000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
    console.log('✅ MongoDB connected');

    await agenda.start();
    console.log('⏰ Agenda scheduler ready');

    // 🧹 Clear old jobs on start (optional, but useful during testing)
    const deleted = await agenda.cancel({}); // delete all jobs
    console.log(`🧹 Cleared ${deleted} old scheduled jobs`);

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})
.catch(err => console.error('❌ MongoDB connection error:', err));

