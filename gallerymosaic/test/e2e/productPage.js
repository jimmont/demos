var productPage = function(){
	this.thing = element(by.css('selector'));
	this.stuff = element.all(by.repeater('stuff in things'));
	this.home = function(){
		browser.get('url');
	};
};
module.exports = new productPage();
