Bankist app created as part of javascript course on Udemy.

##Functionality:

1. Displays:
   - Money movements (deposits/withdrawals) with internationalized dates and values
   - Total deposits, withdrawals, and interest
   - Total Balance (top right)
   - Time when information was updated
2. Sorting
   - Money movements can be sorted by amount using the button at the bottom.
   - Clicking the sort button will toggle sorting, so clicking it again will undo the sort.
3. Transfers
   - Can make transfers between users (see test users below)
   - allows transfers less than amount you have available in your account
   - displays withdrawal after transfer is made, also appears in destination account
4. Requesting Loans
   - Loans are allowed if they are less than 10 times the size of the largest deposit on the account
     - Yes this could easily be cheated by just getting larger and larger loans, in a real situation there would be more complex mechanics
   - There is a 2.5 second delay before the loan appears to simulate an approval process
5. Closing Account
   - Account can be closed by inputting username and password and confirming.
   - This will log out the user and delete their account
   - reloading the page will the account back
6. Internationalization
   - all numbers and times are formatted based on user locale (see test users below).
   - currency changes based on user as well
7. Timer
   - upon login a 5 minute timer starts, at the end of which the user will be logged out and the UI will be hidden
   - clicking any of the buttons on the screen that perform an action after login will start the timer over

##Test Users:

1. Jonas Schmedtmann (author of the course)

   - login: js/1111
   - locale: pt-PT
   - currency: Euro
   - interest-rate: 1.2

2. Jessica Davis

   - login: jd/2222
   - locale: en-US
   - currency: USD
   - interest-rate: 1.5

3. Steven Thomas Williams

   - login: stw/3333
   - locale: en-GB
   - currency: Pounds
   - interest-rate: 0.7

4. Sarah Smith
   - login: ss/4444
   - locale: es-ES
   - currency: Euro
   - interest-rate: 1.0
