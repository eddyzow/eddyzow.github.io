# Passcode

Hi! I'm Eddy, also known as eddyzow in the virtual world. Today I'd like to introduce to you Passcode, a quick daily game you can play on your phone or your computer. [You can play it here!](https://eddyzow.net/passcode/) The game is inspired by Wordle, but unlike that game, Passcode works solely with numbers:

-   You have five tries to guess the six-digit **passcode.**
-   For each guess, if a tile turns **green**, the digit is correct and in the correct spot. If a tile turns **yellow**, the digit is in the passcode, but not in the correct spot. If a tile turns  **black**, the digit is not in the passcode.
-   Each guess also shows the sum of the error between your guess's digits, and the passcode's digits. The error is the positive difference of two numbers. For example, let's say you guessed 765432:
```
Guess: 7 6 5 4 3 2
Code:  1 2 3 4 5 6
Diff:  6 4 2 0 2 4
       6+4+2+0+2+4 = 18
```
You *could* play Passcode just like Wordle, but that's no fun! Instead, you can do tedious calculations using the sum of the error given to you in each guess. The error is such a powerful tool in this game, and you can solve the passcode in as little as three guesses!

![](https://cloud-gp1yfwkoc-hack-club-bot.vercel.app/0image.png)


I built this app using HTML, jQuery and CSS. The project was completed over a total of ten hours of programming, and I had a blast making it. The passcode for each day is calculated using a seed based on the day that the player is playing on, so each day the passcode is the same for all players. There's also a statistics page on the site as well as dark mode! I've sent this to a few of my friends and classmates, and they now play it every day! We're not exactly mathematicians, so we're trying to figure out how to solve the game as well as find the best opener.

I hope you enjoy Passcode! Feel free to give me suggestions and tips.
