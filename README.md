# BetterLogic
An advanced logic library with variable management for Homey.

Variables can be managed from the settings screen. All variables must be defined before using them in the flows.

Any requests, please post them in https://forum.athom.com/discussion/840/better-logic-variable-management

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