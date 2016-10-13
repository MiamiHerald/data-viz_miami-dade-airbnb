import $ from 'jquery';
import { TweenLite } from 'gsap';
import * as pym from 'pym.js'
window.$ = $;

class Map {
  constructor(el, dataUrl) {
    this.el = el;
    this.dataUrl = dataUrl;
    this.aspectRatio = 1;
    this.width = $(this.el).width();
    this.height = Math.ceil(this.aspectRatio * this.width);
  }

  render() {
    this.mapSettings = this.loadSettings();
    this.drawMap();
    $(window).on(`load`, () => {
      this.pymChild = new pym.Child({ renderCallback: this.resizeMap.bind(this) });
    });
    $(window).on(`resize`, this.resizeMap.bind(this));
  }

  loadSettings() {
    this.windowWidth = $(window).innerWidth();
    this.settings = [];
    this.lat = 25.748503;
    this.lon = -80.286949;
    if (this.windowWidth < 530) {
      this.zoom = 11;
    } else if (this.windowWidth >= 530) {
      this.zoom = 11;
    }

    this.settings.push(this.zoom, this.lat, this.lon);
    return this.settings;
  }

  resizeMap() {
    window.requestAnimationFrame(() => {
      this.width = $(this.el).width();
      this.height = Math.ceil(this.aspectRatio * this.width);

      $(this.el).height(this.height);

      if (this.pymChild) {
        this.pymChild.sendHeight();
      }
    });
  }

  drawMap() {
    cartodb.createVis(`airbnb-map`, this.dataUrl, {
        shareable: false,
        title: false,
        description: false,
        search: false,
        tiles_loader: true,
        center_lat: this.mapSettings[1],
        center_lon: this.mapSettings[2],
        zoom: this.mapSettings[0],
        zoomControl: true,
        cartodb_logo: false,
        urlTemplate: `https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png`,
    })
    .done((vis, layers) => {
      layers[0].leafletMap.setMaxBounds([
        [26.145629, -80.702302], // lat long top left
        [25.188097, -80.062641]  // lat long bottom right
      ])
    })
    .error((err) => {
      console.log(err);
    });
  }
}

const loadMap = () => {
  const $map = $(`.js-map`);

  $map.each((index) => {
    const $this = $map.eq(index);
    const id = $this.attr(`id`);
    const url = $this.data(`url`);

    new Map(`#${id}`, url).render();
  });
}

export { loadMap };
