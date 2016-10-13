import $ from 'jquery';
import { TweenLite } from 'gsap';
import * as pym from 'pym.js'
window.$ = $;

class Map {
  constructor(el, dataUrl) {
    this.el = el;
    this.dataUrl = dataUrl;
    this.aspectRatio = 0.6667;
    this.width = $(this.el).width();
    this.height = Math.ceil(this.aspectRatio * this.width);
    this.lat = 25.748503;
    this.lon = -80.286949;
    this.zoom = 11;
    this.mediumScreenUp = Modernizr.mq('(min-width: 700px)');
    this.pymChild = null;
  }

  render() {
    this.drawMap();
    $(window).on(`load`, () => {
      this.pymChild = new pym.Child({ renderCallback: this.resizeMap.bind(this) });
    });
    $(window).on(`resize`, this.resizeMap.bind(this));
  }

  resizeMap() {
    window.requestAnimationFrame(() => {
      this.width = $(this.el).width();
      this.height = Math.ceil(this.aspectRatio * this.width);

      $(this.el).height(this.height);

      if (this.mediumScreenUp) {
        this.zoom = 12;
      }

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
        center_lat: this.lat,
        center_lon: this.lon,
        zoom: this.zoom,
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
