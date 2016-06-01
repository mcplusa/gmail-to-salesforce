
# Gmail to Salesforce - Attach your email to Salesforce in a couple of clicks

<img align="right" height="164" src="https://s3.amazonaws.com/download.mcplusa.com/public+assets/gmail-to-salesforce/icon128.png">


---

[Extension for Google Chrome](https://chrome.google.com/webstore/search/Gmail%20To%20Salesforce?_category=extensions) that integrates your Gmail inbox with [Salesforce](https://www.salesforce.com/).

This extension adds a button to your Gmail page that allows to easily attach your received and/or send emails to Salesforce Objects in a couple of clicks.

**Check out our full documentation on [Our Github Page](http://mcplusa.github.io/gmail-to-salesforce)**

**Do you like this project? Check out what other projects we have at [MC+A](http://mcplusa.com)**

## Usage

Using the Gmail To Salesforce extension is very easy. Just install it as any other Google Chrome extension, authorize it, and use it.

### Step 1. Install the Extension

[Install the extension](https://chrome.google.com/webstore/search/Gmail%20To%20Salesforce?_category=extensions) from the official Chrome Web Store.

### Step 2. Authorize Salesforce

Go to [chrome://extensions](chrome://extensions) and search for *Gmail to Salesforce*. Click on Options and authorize either your Production or Sandbox account.
<center>
<img src="https://s3.amazonaws.com/download.mcplusa.com/public+assets/gmail-to-salesforce/gmail-to-sfdc-options-1.png" width="277" height="385" alt="Extension Options">
<img src="https://s3.amazonaws.com/download.mcplusa.com/public+assets/gmail-to-salesforce/gmail-to-sfdc-options-2.png" width="277" height="385" alt="Extension Options">
</center>

### Step 3. Attach your email to Salesforce

Now when you go to your [Gmail](https://mail.google.com), you'll see a Blue Button on your email. Click it and you'll see all your available Salesforce Objects. Select the ones that you want to attach your email to, and follow the instructions.

<center>
<img src="https://s3.amazonaws.com/download.mcplusa.com/public+assets/gmail-to-salesforce/gmail-to-sfdc-button-1.png" width="624" height="300" alt="Extension Options"><br/>
<img src="https://s3.amazonaws.com/download.mcplusa.com/public+assets/gmail-to-salesforce/gmail-to-sfdc-popup-1.png" width="516" height="300" alt="Extension Options"><br/>
<img src="https://s3.amazonaws.com/download.mcplusa.com/public+assets/gmail-to-salesforce/gmail-to-sfdc-popup-2.png" width="516" height="156" alt="Extension Options"><br/>
<img src="https://s3.amazonaws.com/download.mcplusa.com/public+assets/gmail-to-salesforce/gmail-to-sfdc-popup-3.png" width="214" height="280" alt="Extension Options"><br/>
</center>

## Build from Source

To build this project you'll need to install [Bower](http://bower.io/) and [Grunt](http://gruntjs.com/):
```
$ npm install -g bower
$ npm install -g grunt-cli
```

Once you finish setting up your environment, install the required dependencies

```
$ npm install
$ bower install
```

And build the project

```
$ grunt build
```

## Running from Source

To run the extension on Google Chrome:

```
Go to chrome://extensions
Clic on "Load unpacked extension..."
Select the directory of this project
```

## Testing

Run Karma

```
$ karma start
```
