import dayjs from "dayjs";
import cron from 'node-cron';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { hourlyProcess } from './hourlydeclarations';
import { yearlyProcess } from './yearlydeclarations';

dotenv.config({ path: path.resolve(__dirname, `../${process.env.NODE_ENV ? process.env.NODE_ENV as string : ""}.env`) });

if (!fs.existsSync(process.env.CONFIG_DB_FILE_NAME as string)) {
    fs.copyFileSync(path.resolve(__dirname, "../config.sqlite"), process.env.CONFIG_DB_FILE_NAME as string);
}

cron.schedule(process.env.YEARLY_CRONTAB as string, () => {
    let currentTime = dayjs();
    if (currentTime.month() == 0) {
        yearlyProcess(currentTime);
    }
});

cron.schedule(process.env.HOURLY_CRONTAB as string, () => {
    hourlyProcess(dayjs());
})


console.log(dayjs().format(), 'Server started.');
