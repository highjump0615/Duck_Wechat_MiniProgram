// pages/map/map.js
Page({
  data: {
    markers: [{
      iconPath: "../../images/map-marker.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    pointLatitude: 23.099994,
    pointLongitude: 113.324520,
  },

  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})