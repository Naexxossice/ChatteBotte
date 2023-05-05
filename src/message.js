export default class Message {
  text;

  date;

  bot;

  constructor(text, date, bot) {
    this.text = text;
    this.date = date;
    this.bot = bot;
  }
}
