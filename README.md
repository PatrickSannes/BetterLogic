# Better logic

# BetterLogic
An advanced logic library with variable management for Homey.

Variables can be managed from the settings screen. All variables must be defined before using them in the flows.

Any requests, please post them in https://forum.athom.com/discussion/840/better-logic-variable-management

<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="hosted_button_id" value="4MCP3TLK2LS3N">
<input type="image" src="https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal – The safer, easier way to pay online!">
<img alt="" border="0" src="https://www.paypalobjects.com/nl_NL/i/scr/pixel.gif" width="1" height="1">
</form>

V1.0.0
Rewrite to SDK 2 !!

V0.9.12
* Ooops, sorry :(

V0.9.11
* Hotfix: Only store changed variables in insights to prevent storage loss

V0.9.10
* Feature: Add NumSlide device. When adding, first you have to specify the min, max and step size. After that you can select your number variable.
* Feature: Add Trigger variable with action cards. This trigger fires one time when being triggered
* Feature: Add Trigger device to create a button that can trigger
* Feature: Add trigger to API. Call 
	* PUT for increment: HTTP://HOMEYADDRES/api/app/net.i-dev.betterlogic/trigger/VARIABLENAME This triggers the given variable


V0.9.9
* Hotfix: Removed the tokens from the trigger cards. If you need the value, use the TAG. Sorry if I broke your flow.

V0.9.8
* Feature: Add global TAG support
* Feature: Added NumSlide device for numeric value changes. It ranges from 0-100 with steps of 0.5
* Feature: Changed the i and d in increment to increment and decrement (left the i and d for backward compatibility)
* Feature: Added #DD (day), #MM (month), #YYYY (year), #HH (hours), #mm (minutes) #SS (seconds) as reserved words next to timenow in the mathjs flows. You can now for example assign #HH to a variable to get the hours. Also I changed timenow to #timenow for consistency.
* Bug: Replace filter with find when looking up devices
* Bug: Fixed delete all function so it also removes all Insights

V0.9.7
* Feature: Add increment or decrement to API. Call 
	* PUT for increment: HTTP://HOMEYADDRES/api/app/net.i-dev.betterlogic/VARIABLENAME/i/VALUE  Increments the variable with the given value
	* PUT for decrement: HTTP://HOMEYADDRES/api/app/net.i-dev.betterlogic/VARIABLENAME/d/VALUE  Decrements the variable with the given value
* Bug: Delete all insights on delete all
* Typo: Change casing of boolean in the variable type dropdown
* Bug: Fixed the date time representation in the grid
* Bug: Fixed the variable grid. It was very broken when editing in a filtered list. Sorry for people who lost variables due to this bug.
* Bug: Bitflip was not working after an update. This is fixed

V0.9.6
* Feature: Add decimal support in the number action cards. This will work starting from Homey V0.10
* Feature: Turn on insights for boolean and number values. Existing variables will also be turned on
* Feature: Implement backup and restore of variables offline 
* Bug: Fix propagation of updates from bitflip
* Bug: Fix a bug where setting a variable with the same value did not trigger the variable set card
* Added a donate button as requested by MartijnDeRhoter

V0.9.5
* Switch to tools category

V0.9.4
* Hotfix: Fix initialization of empty collection after deleted
* Added some extra logging

V0.9.3
* Hotfix: Fix variable loss after homey update to 0.8.27


V0.9.2
* Feature: Add Mathjs.org action card. Only number output is supported. (Be aware, there is no syntax validation)
    * For supported features see http://mathjs.org/docs/expressions/syntax.html 
	* An example could be $var1$ + 100. This is then assigned to the selected number value
* Feature: Add $timenow$ as a special variable for mathjs. This will retrieve the current time in seconds since epoch This variable is not stored in the overview, but used in expressions.
	* In the condition flow this can be used to test if a certain time is passed. $timenow$ > $storedTime$ + 1800 (half an hour)
    * In the action flow this can be used to create a time in the future by donig $timenow$ + 1800 (half an hour)
* Feature: Add card that triggers when a variable is set but is or is not changed
	* The last changed date/time in the grid overview is now changed to the last set date/time

V0.9.1
* Feature: Add Mathjs.org condition card. Currently only boolean logic is supported. (Be aware, there is no syntax validation)
    * For supported features see http://mathjs.org/docs/expressions/syntax.html 
	* An example could be $var1$ > 100 and $var1$ < 200 and $bool1$
* Feature: Add card that triggers on change of one of the specified variables (Be aware, there is no syntax validation)

V0.9.0
* After testing it is very stable, so almost at version 1.
* Removed: Insights is removed for now until Athom stabalized the API for bool, int and string
* Feature: Add toggle of boolean (true->false or false->true) to API support
    * PUT: HTTP://HOMEYADDRES/api/app/net.i-dev.betterlogic/VARIABLENAME/toggle This will force to flip the boolean value
* Feature: Enable authorization on the API.	   
* Feature: Add 'text starts with' condition
* Bugfix: Dont change last changed timestamp when value is edited manually but not changed.

V0.1.0

* BREAKING CHANGE: Due to renaming bool values to boolean all variables and cards need to be re-added.
* Bugfix: Dropdown was not working for boolean values in the .
* Feature: Added BitFlip device to switch a boolean value from the device and phone app.
* Feature: Added API support to GET, GET all variables and SET (post) a value.
	* GET: HTTP://HOMEYADDRES/api/app/net.i-dev.betterlogic/VARIABLENAME
	* GET: HTTP://HOMEYADDRES/api/app/net.i-dev.betterlogic/ALL (Get all variables)
	* PUT: HTTP://HOMEYADDRES/api/app/net.i-dev.betterlogic/VARIABLENAME/VALUE  //Please ensure that the value matches the type, otherwise it will not be set.
* Feature: Add date time last changed to settings screen with format (YYYY-MM-DD HH-MM-SS)
* Feature: Implement insights. (note that bool and string values are not displayed yet in the module)
* Feature: Implement card that can set all variables. It converts the type. If the type matches the value is setted
* Feature: Implement trigger card that triggers on a number change. (minimal difference, minimal increase or minimal decrease)

V0.0.3
* Bugfix: Add more variable checks to prevent crashes on flows that contain variables that are deleted.

V0.0.2
* Bugfix: Bug that prevented creating variables when app is first installed. 

V0.0.1
* Initial release
