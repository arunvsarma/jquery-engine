# Engine - JQuery Plugin

init()

### getBackgroundInfo():
This JQuery plugin was developed sometime during 2014-2015 (when we all loved Hashbangs in our URLs). The plugin was developed to ease front-end application development and rapid prototyping. Basically, the plugin consumes a JSON configuration file to load the specified partials into containers (kinda similar to AngularJS). It also exposes some utility methods to help with development.

> The plugin is no longer in active development and this is an early version of the plgin that I found in my archives, hence **Support will be limited**. It uses really old versions of dependent libraries (Jquery, bootstrap etc). Upgrading them to the latest versions might cause unexpected issues.

### getDependenciesList():
Core Libraries
* JQuery v2.1.1
* Bootstrap v3.2.0 (CSS and JS)
* red 
* * jquery.engine.js v5.00.03.2015

### getStarted():
Once you have pulled the code to your computer, you will find the following folders
* **src**
* * **config**
* * * application.json
* * * notification_feed.json
* * **controllers** - *Folder containing all your controllers*
* * * appcomponents.js
* * * index.js
* * **libs**
* * * core
* * * * bootstrap
* * * * - css
* * * * - - bootstrap-theme.min.css
* * * * - - bootstrap.min.css
* * * * - js
* * * * - - bootstrap.min.js
* * * * * jquery
* * * * - jquery-2.1.1.min.js
* * * * * red
* * * * - jquery.engine.js
* * * * - jquery.engine.min.js
* * * * utls - *Folder containing third-party libraries (I will not list them)*
* * **models** - *Folder containing any models you might use*
* * * appvars.js - *Will contain all the global variables and constants*
* * **skin** - *Folder containing CSS, Fonts and Images (I will not list them)*
* * * css
* * * fonts
* * * images
* * **views** - *Folder containing your HTML partials*
* **index.html** - *HTML __mommy__ that will load all the partials*
  

#### setConfiguration():
The first step is to open the **index.js** in this sample. You will see the following code which initializes the plugin with all the parameters.
The comments inline below will explain each of the parameters

```
$('#page-wrapper').engine({
        strConfigurationPath                : 'config/application.json', //The path for the configuration file
        strDefaultSkin                      : 'light', //If you have a dark and light theme, this sets the detault one
        objSkins                            : {dark:'', light:'skin/css/styles.css'}, //If you have a dark and light theme, this sets the location of the css file
        strSkinKey                          : 'mode', // custom key to use while changing themes in the browser. For ex: mode=dark will set the dark theme
        strConfigKey                        : 'config', // custom key to use while changing configs in the browser. For ex: config=<path to json file> will set the configuration file
        strViewsPath                        : 'views/', // folder containing the partials HTMLs
        strControllersPath                  : 'controllers/', // folder containing the controllers
        strPageTitle                        : 'Engine Sample Page', // Page title that will be set as the Title in the browser
        strNotificationFeedPath             : 'config/notification_feed.json', // Path for the custom notification feed which will display maintenence messages etc
        objAppServerURL: { // Mappings for API host URLs
          'SELF': '', // empty will point to localhost
          'DEV': 'https://app-dev.myserver.com',
          'STAG': 'https://app-stag.myserver.com',
          'PROD': 'https://app.server.com'
        },
        boolShowBackButton                  : true // renders a back button on the UI (I don't think this works anymore!)
  });
  $engine = $('#page-wrapper').data('engine'); // Allows you to use the plugin methods everywhere
  $engine.setApplicationEnvironment('SELF'); // Sets the server map. This can be made dynamic based on current host in the browser
  ```


#### setPageInConfiguration():
The **application.json** most important file used by the plugin. The plugin uses the data to render the pages and add the libraries used by the application.
* * libraries[] - This is a list of objects that will contain the libraries that will be loaded by the application. They are loaded only once and don't get reloaded on navigation. They will load again if you refresh the browser.

```
"libraries": [
  {
      "name":"fontawesome", // name of the library. Not really used for functionality
      "type":"css", // file type [Supports only - 'css' or 'javascript']. If it is a CSS, it will be added to the HEAD
      "fileVersion": "1.0", // file versioning. Used for cache busting as well
      "libpath":"skin/fonts/glyphs/css/font-awesome.min.css" // location of the file
  }
]
```
As for the pages, there is a another list and some parameters that would need to be specified.

* * page[] - This is a list of objects that will contain the **page** that will be rendered using partials and it will also associate the controller that would be used. The **application.json** in the sample also contains configuration with and without a side navigation.

```
"pages": [
            {
                "pageName":"HOME", // page hash that would be using after the hashbang. For ex: #!HOME
                "pageTitle":"Homepage", // page title. Can be used somewhere on the app if required
                "pageSubTitle":"This is the homepage", // page sub-title. Can be used somewhere on the app if required
                "layoutColumns": 1, // number of columns in the layout. This totally depends on bootstrap
                "showInNavigation":false, // The plugin used to have a feature to add a navigation automatically using the names from the pageName attribute above. True - would enable the functionality
                "pageController": "", // the file name of the controller js file. You should not add the '.js' here. For ex: it will just be 'mycontroller' and not 'mycontroller.js' 
                "pageControllerVersion": "4.94", // version of the controller. Used for individual file cache busting
                "componentList": [ // you can have many more items here. The hierarchy in the list will also determine the hierarchy of the components loaded into the page
                    {
                        "view": "header", // the partial HTML filename (without the '.html')
                        "fileVersion": "4.94", // version of the partial. Used for individual file cache busting
                        "wrapper": "row", // maps to default Bootstrap classes
                        "column": "page" // custom css class that would render this as a single column layout. Currently only suports 'page'

                    },
                    {
                        "view": "placeholder",
                        "fileVersion": "4.94",
                        "wrapper": "row",
                        "column": "page"

                    },
                    {
                        "view": "footer",
                        "fileVersion": "4.94",
                        "wrapper": "row",
                        "column": "page"
                    }
                ]
            }
         ]
```

To add more pages, all you need to do is add one more item like the one above within the **componentsList** array. Follow the sample to try out.


#### setAPICalls():
It is usually a good practice to keep the backend and UI applications seperate. You need to ensure here that CORS is handled in your backend for the UI to make calls to it. You would need to add some additional code and intelligence to get the current location and map to a host from which you would be consuming the APIs. As far as the plugin is concerned, it doesn't really worry about the way used to make the API calls. All this can be some custom implementation as well.
If you plan to use the plugin's environment settings, you would need to update some configurations. If you go back to the **setConfiguration()** section above, the **objAppServerURL** object, you can map the environment host URLs that you would be using to consume APIs. For ex: To use the DEV APIs on a develeopment host, you can change the 'DEV' parameter of the  **objAppServerURL** to something like 'https://mydev-apis.myapphost.com'. You should then set the plugin environment using:

```
 $engine.setApplicationEnvironment('DEV');
```

You can add many custom layers here depending on how you are using the plugin. 

#### runApplication():
Running the application is the same as you run any simple web application. You need to host it on a webserver and point your browser to the URL. No rocket science! :)


> You are free to do whatever you want with the code. If you want to improve it and contribute, please go ahead and raise a PR.

thankYou();
