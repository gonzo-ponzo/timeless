from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes
import aiohttp
import datetime
from dotenv import load_dotenv
import os
import pytz

load_dotenv()
TOKEN = os.environ.get("TOKEN")
IP_SERVER = os.environ.get("IP_SERVER")


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Sends explanation on how to use the bot."""
    await update.message.reply_text("Hi! Use /notify to run telegram notifications")


async def alarm(context: ContextTypes.DEFAULT_TYPE) -> None:
    """Start notifications."""
    belgrade_tz = pytz.timezone("Europe/Belgrade")
    current_time = datetime.datetime.now(belgrade_tz)
    current_hour, current_minute = current_time.hour, current_time.minute

    job = context.job
    user = await context.bot.getChat(job.chat_id)
    username = user.username

    async with aiohttp.ClientSession() as session:
        response = await session.get(
            url=f"https://{IP_SERVER}:8000/api/records/telegram/{username}"
        )
        data = await response.json()
    if type(data) == dict:
        await context.bot.send_message(
            job.chat_id,
            text="Please check your telegram on Salonium profile and run /notify again.",
        )
        job.schedule_removal()

    elif (current_hour == 8 and current_minute >= 53) or (
        current_hour == 9 and current_minute <= 8
    ):
        text = ""
        for record in data:
            text += f"{record['time'][:5]} - {record['service']['en']}\n"
        await context.bot.send_message(
            job.chat_id, text=f"Your records for today:\n{text}"
        )
    elif 9 <= current_hour < 22:
        for record in data:
            hour, minute = int(record["time"].split(":")[0]), int(
                record["time"].split(":")[1]
            )
            new_hour = (current_minute + 15) // 60 + current_hour
            new_minute = (current_minute + 15) % 60

            if (
                datetime.time(hour=current_hour, minute=current_minute)
                < datetime.time(hour=hour, minute=minute)
                <= (datetime.time(hour=new_hour, minute=new_minute))
            ):
                await context.bot.send_message(
                    job.chat_id,
                    text=f"Your next record '{record['service']['en']}' will start at {record['time'][:5]}",
                )
                break


async def notify(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Add a job to the queue."""
    chat_id = update.effective_message.chat_id
    try:
        user = await context.bot.getChat(context._chat_id)
        username = user.username
        async with aiohttp.ClientSession() as session:
            response = await session.get(
                url=f"https://{IP_SERVER}:8000/api/users/user/telegram/{username}"
            )
            text = await response.text()
        if text == "false":
            await update.effective_message.reply_text(
                "Please check your telegram on Salonium profile and run /notify again."
            )
        else:
            await update.effective_message.reply_text(
                "Notifications starts succesfully"
            )
            context.job_queue.run_repeating(
                alarm, 1800, chat_id=chat_id, name=str(chat_id), data=1800
            )
    except (IndexError, ValueError):
        await update.effective_message.reply_text("Usage: /notify")


def main() -> None:
    """Run bot."""
    application = Application.builder().token(TOKEN).build()
    application.add_handler(CommandHandler(["start", "help"], start))
    application.add_handler(CommandHandler("notify", notify))
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
