
# Visual regression testing

Faster, more user friendly visual regression testing. Used to tell a developer which components on a website have been affected by code changes, and gives a developer more visibility over a website. Involves three steps:

* Create reference screenshots.
* Create test screenshots.
* Compare the two to check if the test screenshots have changed.

# What is the purpose of Ocularjs

* Super quick, can run 80 different tests in under 5 seconds.
* Should be used to provide quick, easy-to-read feedback on what components have changed.
* Removes the manual process of testing a whole site as it tells the user exactly what has changed.
* The user can then decide if the changes are correct or not.

# To Run
```sh
npm install ocularjs -g
ocularjs init
ocularjs
```

# Ocularjs init

This creates a folder called `ocular` in the directory in which the command is run. Inside this folder will be a `data.json` file which is where the settings for the project will be set.

# Data.json

* **PageUrl**: This is the url that `Ocularjs` will open and take screenshots from, make sure all your components are on this page.
* **Viewports**: This is an object with a list of viewports, `Ocularjs` will open every viewport and take a screenshot for each component. This object can have a list of named viewports, each with an array containing screen width and screen height in that order.
* **SelectorList**: This contains the list of components that you want to take screenshots of, and each item requires a name and a selector. The selector can be a data attribute, class or and ID.

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

* **Reference**: This will create the base screenshots for each component on each breakpoint. This will be stored in the `ocular` folder under `screenshots/reference`.
* **Test**: This will generate a second set of screenshots, for the same components and breakpoints as `Reference`. It will then compare the `Test` screenshots against the `Reference` screenshots and will tell the user which components have changed and what breakpoint they have changed on.
* **Exit**: This will exit out of the `Ocularjs` process and will not ask another question. Both of the other options will ask the question again once that process has been completed.
