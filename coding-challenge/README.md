# Coding Challenge: Slot Machine App

You've landed a summer gig in Las Vegas! Unfortunately, due to some restrictions, the casinos are closed. Your boss wants to move some of the business online and asks you to build an app — a simple slot machine game, with a little twist. Build it to ensure that the house always wins!

## Brief

At the beginning of a game, players receive an initial allocation of 10 credits. Initiating a spin by pulling the machine lever incurs a cost of 1 credit. The game interface consists of a single row featuring three blocks. To secure a win, players must align the same symbol in each block. There are four potential symbols: cherry (rewarding 10 credits), lemon (rewarding 20 credits), orange (rewarding 30 credits), and watermelon (rewarding 40 credits). While a player may enjoy a streak of wins, there's a caveat introduced by the house. Additionally, a "CASH OUT" button is provided on the screen, but it comes with an intriguing twist.

## Tasks

### Implementation Details:

Language: JavaScript/TypeScript
Framework: Vue 3 - TailwindCSS - Pinia/Vuex (If Required)

### Logic:

-   If a user possesses fewer than 40 credits in the game, their rolls should be entirely random.
-   Should a user hold between 40 and 60 credits, a slight deviation from randomness is introduced:
    -   After a successful roll, the function will perform a 30% probability roll to determine if a re-roll should occur for that round.
    -   If this roll returns true, the function will execute a re-roll and return the new result.
-   For users with more than 60 credits, the function behaves similarly. However, in this scenario, the likelihood of a re-roll occurring for the round increases to 60%.
    -   If the re-roll condition is met, the function will re-roll and return the updated result.
-   Additionally, implement a cash-out endpoint that facilitates the transfer of credits from the game to the user.

## UI:

Create a clean and simple table with three blocks arranged in a row. Add a button beside the table to initiate the game.

For the symbols, you can use initial letters like 'C' for cherry, 'L' for lemon, 'O' for orange, and 'W' for watermelon. However, using SVG graphics (which can be found online) would earn extra points.

When a roll-request is initiated, all blocks should animate as if they're spinning. You can use an 'X' character for this, but using SVG spinners (found online) would be even better.

After the roll, the first symbol should continue spinning for an additional second before revealing the result. Then, the second symbol should reveal itself after 2 seconds, followed by the third symbol after 3 seconds.

If the player wins the round, their credit should increase by the amount mentioned before. If they lose, their credit is reduced by 1.

Lastly, include a button labeled "CASH OUT". When the user hovers over it, there's a 50% chance that the button will move in a random direction by 300 pixels. Additionally, there's a 40% chance that it becomes unclickable.

## Testing:

-   Write tests for your business logic.

## Evaluation Criteria

-   JS best practices.
-   Framework guideline compliancy
-   Completeness: Did you complete the features as briefed?
-   Correctness: Does the solution perform in sensible, thought-out ways?
-   Maintainability: Is the code written in a clean, maintainable way?
-   Testing: Was the system adequately tested?
