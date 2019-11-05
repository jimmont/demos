class TheControls extends HTMLElement{
	constructor(){
		super();
		this.attachShadow({mode:'open'});
		// {tags: {N: {}...}, taglist: []}
		this.data = {};
		this.addEventListener('click', this.clicked);
	}
	clicked(e){
		var $ = e.composedPath()[0], tags = this.data.tags, prev;
		e.stopPropagation();
		switch($.nodeName){
		case 'INPUT':
			switch($.value){
			case 'all':
				Array.from(this.shadowRoot.querySelectorAll('button')).forEach(($)=>{
					tags[$.value].active = true;
					$.classList.add('active');
				});
			break;
			case 'clear':
				Array.from(this.shadowRoot.querySelectorAll('button')).forEach(($)=>{
					tags[$.value].active = false;
					$.classList.remove('active');
				});
			break;
			};
			this._previous = '';
			this.dispatchEvent(new CustomEvent('change-active', {detail: this.data, cancelable: true, composed: true, bubbles: true}));
		break;
		case 'BUTTON':
			if(e.metaKey || e.ctrlKey){
				prev = this.shadowRoot.querySelector(`button[value="${this._previous}"]`);
				if(prev && prev !== $){
					tags[prev.value].active = prev.classList.toggle('active');
				}
			};
			this._previous = $.value;
			tags[$.value].active = $.classList.toggle('active');
			this.dispatchEvent(new CustomEvent('change-active', {detail: this.data, cancelable: true, composed: true, bubbles: true}));
		break;
		};
	}
	//<button value="10" class="active">10</button>
	tagHTML(item){
		return `<button value="${ item.name }" class="${ item.active ? 'active':'' }">${ item.name }</button>`
	}
	render(){
		this.shadowRoot.innerHTML = `
<style>
button{font-weight:bold;}
button.active{background-color:var(--dark);color:white;}
</style>
<input type=button value=all>
<input type=button value=clear>
<br>
${ this.data.taglist.map(this.tagHTML).join(' ') }
		`;
	}
	get model(){
		return this.data;
	}
	set model(data){
		this.data = data;
		this.render();
		return true;
	}
}
window.customElements.define('the-controls', TheControls);
