
# Visual regression testing

Faster, more user friendly visual regression testing. Used to tell a developer which components on a website have been affected by code changes, and gives a developer more visibility over a website. Involves three steps:

* Create reference screenshots.
* Create test screenshots.
* Compare the two to check if the test screenshots have changed.

# Acceptance criteria

* Developer must be able to run the tests while developing to get instant feedback.
* Should be able to run 100 tests in under 5 seconds
* Needs an easy to use cli so tests can easily be accepted

# To Run

* npm install ocularjs (-g for windows)
* ocularjs init
* ocularjs

# Ocularjs init

This creates a folder called `ocular` in the directory in which the command is run. Inside this folder will be a data.json file which is where the settings for the project will be set.

# Data.json

The base data.json file is shown below. There are three parts to this JSON file. The `pageUrl` which is the url that you want to take screenshots from. `Viewports` is an object with a list of viewports. They can be defined by the developer with a name and an array containing screen width and screen height, in that order. Finally there is a selector list, which contains the selector name for each component you want to take a screenshot from. In the example below I have used data attributes but classes and ID's can be used.

```
{
  "pageUrl": "http://localhost:7000/",
  "viewports": {
    "smallScreen": [320, 480],
    "mediumScreen_landscape": [768, 1024],
    "mediumScreen_portrait": [1024, 768],
    "largeScreen" : [1920, 1080]
  },
  "selectorList": {
    "containerOne": "[data-container-one]",
		"containerTwo": "[data-container-two]"
  }
}
```

# Ocularjs

This will ask the user a question with three options:

* Reference
* Test
* Exit

Reference will create the base screenshots for each component and breakpoint specified in the data.json. This will be stored in the `ocular` folder under `screenshots/reference`.

Test will generate a second set of screenshots, the same ones as the reference. It will then compare these new screenshots against the reference and will tell the user which components have changed and what breakpoint they have changed.

Exit will stop the console asking the user a question. After Reference or Test is ran it will output the results in the console and then ask the user the same question, with the three options.
