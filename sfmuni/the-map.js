// regular 404s from unpkg, moved d3 to global: import * as d3 from 'https://unpkg.com/d3?module';
import './the-controls.js';

class TheMap extends HTMLElement{
	constructor(){
		super();
		this.attachShadow({mode:'open'}).innerHTML = `
<style>
:host{display:block;width:100%;height:100%;}

svg{border:1px dotted #555;background:#0df;height:100%;width:100%;position:fixed;}
g[src*='neighborhoods']{fill:green;stroke:#ccff0033;stroke-width:4px;}
g[src*='arteries']{display:none;fill:none;stroke:#000;stroke-width:0.5;}
g[src*='freeways']{display:none;fill:none;stroke:#fff;stroke-opacity:0.7;stroke-width:0.5;}
g[src*='streets']{display:none;stroke:#fff;fill:none;stroke-opacity:0.8;stroke-width:0.2px;}
.show-freeways g[src*='freeways'],
.show-streets g[src*='streets'],
.show-arteries g[src*='arteries']{display:inline;}
.vehicles circle{fill:red;fill-opacity:0.7;}
.vehicles circle:hover{fill:#cf0;fill-opacity:1;stroke:#555;stroke-width:0.1;}
.vehicles text{display:none;fill:var(--dark);font-size:1rem;pointer-events:none;}
.vehicles g:active text,
.vehicles g:hover text{display:block;}
button{font-weight:bold;}
button.active{background-color:var(--dark);color:white;}
/*.vehicles g{transition:all 500ms;}*/
</style>
<svg>
	<g class=layers></g>
	<g class=overlay>
<foreignobject class="filter" x="2.5rem" y="2rem" width="150" height="100%">
<the-controls></the-controls>
</foreignobject>
	</g>
</svg>
		`;
		this._setup = false;
		this.map = d3.select(this.shadowRoot.querySelector('svg'))
		this.layers = d3.select(this.shadowRoot.querySelector('.layers'))
		this.controls = this.shadowRoot.querySelector('the-controls')
		this.data = {
			time: 0
//'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&t=0'
			,tags: {}
			,taglist: []
			,vehicles: []
			,timer: 0
			,interval: 30
			,scale: 100000
			// San Francisco
			,lon: -122.4, lat: 37.76
			,projection: null
			,pathprojector: null
			// 
			,content: './sfmaps/neighborhoods.json ./sfmaps/arteries.json ./sfmaps/freeways.json ./sfmaps/streets.json'
		}
		this.addEventListener('change-active', this.vehicleDrawer)
	}
	tagisactive(active, tag){
		if(tag.active) active[ tag.name ] = tag;
		return active;
	}
	vehicleisactive(item){
		return this[ item.routeTag ] ? true : false;
	}
	vehicleDrawer(){
		// show the active-tag vehicles
		var data = this.data, $, vehicleList = data.vehicles.filter(this.vehicleisactive,
				data.taglist.reduce(this.tagisactive, {}) );

		requestAnimationFrame(()=>{
			// update
			$ = this.layers
			.select('g.vehicles')
			.selectAll("g")
			.data(vehicleList)
			.each(this.vehicleDetails)
			;
			// enter
			$.enter()
			.append("g")
			.each(this.vehicleDetails)
			;
			// exit
			$.exit().remove();
		})
	}
	//item = {dirTag:"7____O_F00", heading:"225", id:"6719", lat:"37.784794", lon:"-122.403969", predictable:"true", routeTag:"7", secsSinceReport:"17", speedKmHr:"19"}
	vehicleDetails(item, i, vehicleList){
		var $;
		this.setAttribute('transform', `translate(${item.position[0]}, ${item.position[1]}) scale(0.5)`);
		$ = this.querySelector('text');
		if($){
			$.textContent = item.routeTag;
		}else{
			this.innerHTML = `<circle cx=0 cy=0 r=5 /><text>${ item.routeTag }</text>`;
		};
	}
	vehiclePostion(item){
		item.position = this.projection([+item.lon, +item.lat]);
	}
	tagSorter(a,b){
		return a.name < b.name ? -1 :(a.name > b.name ? 1 : 0); 
	}
	updateFinish(res){
		this.data.timer = setTimeout(()=>{ this.update(); }, 1000 * this.data.interval);
		console.log('updated',res);
		return res;
	}
	update(){
		clearTimeout(this.data.timer);
		// apparently only http is available
		d3.json(`http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&t=${this.data.time}`)
		.then((json)=>{
			var taglist, data = this.data;
			// get all the unique routeTags as a sorted list
			taglist = json.vehicle.reduce(this.vehiclehash, data).taglist;
			data.taglist = taglist = Array.from(new Set(taglist)).sort(this.tagSorter);
			data.vehicles = json.vehicle;
			// easier to interpret the position here than passing the pieces and parts around
			data.vehicles.forEach(this.vehiclePostion, data)

			this.vehicleDrawer();
			this.controls.model = data;

			return this.updateFinish(json);
		}).catch((res)=>{
			return this.updateFinish(json);
		});

	}
	vehiclehash(data, item){
		var name = item.routeTag, tag = data.tags[ name ];
		if(!tag){
			tag = data.tags[ name ] = {name:name, active:true};
		};
		data.taglist.push( tag );
		item.tag = tag;
		return data;
	}
	layerDrawer(json){
		requestAnimationFrame(()=>{
			var data = this.data, $;
			$ = this.layers
			.select(`g[src="${json.path}"]`)
			.selectAll("path")
			.data(json.features)
			.attr("d", data.pathprojector)  
			;
			$.enter()
			.append("path")
			.attr("d", data.pathprojector)  
			;
			$.exit().remove();
		});
	}
	// zooming adjusts transform and visible layers/detail
	mapView(position={}){
		cancelAnimationFrame(this._rafmap);
		this._rafmap = requestAnimationFrame(()=>{
			var z = position.k, view, layer, layers = this.layers;
			// I don't know d3
			view = layers._groups[0][0].classList;
			layer = 'show-streets';
			if(view.contains(layer)){
				if(z <= 6) view.remove(layer);
			}else if(z > 6){
				view.add(layer);
			};
			layer = 'show-arteries';
			if(view.contains(layer)){
				if(z <= 3) view.remove(layer);
			}else if(z > 3){
				view.add(layer);
			};
			layer = 'show-freeways';
			if(view.contains(layer)){
				if(z <= 1.5) view.remove(layer);
			}else if(z > 1.5){
				view.add(layer);
			};
			layers.attr("transform", position);
		});

	}
	connectedCallback(){
		var data;
		if(!this._setup){
		// initial setup: projection, load and draw layers, start updating
			data =  this.data;
			data.projection = d3.geoMercator().scale(data.scale).center([+data.lon, +data.lat]);
			data.pathprojector = d3.geoPath().projection(data.projection);

			this.map.call(
				d3.zoom()
				.scaleExtent([1,30])
				.on('zoom', ()=>{ this.mapView(d3.event.transform) })
			)

			data.content.trim().split(/\s+/).map((path, i) => {
				this.layers.append('g').attr('src', path)
				d3.json(path)
				.then((json)=>{
					json.path = path;
					this.layerDrawer(json);
					return json;
				})
				.catch((err)=>{
					console.warn('problem layer',path,err);
					return err;
				})
				return path;
			});
			this.layers.append('g').attr('class','vehicles');
		}
		this.update();
	}
	disconnectedCallback(){
		// stop updating
		clearTimeout(this.data.timer);
	}
}
window.customElements.define('the-map', TheMap);
