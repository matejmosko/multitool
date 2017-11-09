<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>impressPlayer Console</title>
  <base href="{{{dirname}}}/js" />
  <link rel="import" href="{{{appPath}}}/node_modules/xel/xel.min.html">
  <!--<link rel="stylesheet" href="./node_modules/xel/stylesheets/material.theme.css">-->
  <link rel="stylesheet" href="{{{appPath}}}/node_modules/xel/stylesheets/galaxy.theme.css">
  <link rel="stylesheet" href="{{{appPath}}}/css/styles-console.css">
</head>

<body>
  <div id="container">
    <div id="topbox">
      <x-card id="infobox">
      </x-card>


    </div>

    <div id="main">
      <div id="content">
        <x-label>Select subtitles file (txt)</x-label>
        <x-input id="selectSubtitles"></x-input>
      </div>

      <div id="sidebar">
        <div id="sideCards">
          <x-card>
          </x-card>
        </div>
      </div>
    </div>
  </div>
  <x-dialog id="exitDialog">
    <h4 id="exitTitle">Are you sure about exiting Multitool?</h4>
    <p id="exitText">Actually nothing bad could happen if you exit now, but still. <br />Do you really want to do it?</p>
    <x-buttons tracking="-1" id="windowControls">
      <x-button id="reallyQuit" class="danger">
        <x-box>
          <x-icon name="exit-to-app"></x-icon>
          <x-label id="exitAgree">Yes, get me out of here!</x-label>
        </x-box>
      </x-button>
      <x-button id="doNotQuit">
        <x-box>
          <x-icon name="replay"></x-icon>
          <x-label id="exitDisagree">No, I haven't finished yet</x-label>
        </x-box>
      </x-button>
    </x-buttons>
  </x-dialog>
</body>

<script id="require">
  <!--// You can also require other files to run in this process
  require({{{consolePath}}});
  //require("consolePathPlaceHolder");
</script>

</html>
