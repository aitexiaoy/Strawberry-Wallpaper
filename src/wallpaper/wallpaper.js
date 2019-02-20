// Authors
// Tom Watson tom@tomjwatson.com
// Jack Lypskyi https://github.com/avaganz


const $ = require('nodobjc')

// Import "Foundation" and "Cocoa" frameworks
$.framework('Foundation')
$.framework('Cocoa')

module.exports.set = function(file) {

  const imageURL = $.NSURL('fileURLWithPath', $(file))
  const imagePath = $(imageURL, 'absoluteString')

  const screens = $.NSScreen('screens')

  // Change background for all connected displays
  for(let i = 0; i < screens('count'); i++) {

    const screen = screens('objectAtIndex', i)

    const currentImagePath = $(
      $.NSWorkspace('sharedWorkspace')('desktopImageURLForScreen', screen),
      'absoluteString'
    )

    // Get current background image properties (fill, fit, scale etc.)
    const screenOptions = $(
      $.NSWorkspace('sharedWorkspace')('desktopImageOptionsForScreen', screen),
      'mutableCopy'
    )

    // Change background image for current screen
    const success = $.NSWorkspace('sharedWorkspace')('setDesktopImageURL', imageURL, 'forScreen', screen, 'options', screenOptions, 'error', null)

    if(!success) {
      throw 'An error has occurred while attempting to change the background image'
    }

  }

}
