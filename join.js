
class As{
	constructor(source, alias){
		this.source = source;
		this.alias = alias;
	}
	toEquation(){
		let src;
		if(typeof this.source === 'string'){
			src = this.source;
		}
		if(!this.source.toEquation){
			throw new Error('Invalid object');
		}
		else{
			src = '(' + this.source.toEquation() + ')';
		}
		return `(${src}) AS ${this.alias}`;
	}
	
}

class Join{
	constructor(left, right, on){
		this.left = left;
		this.rigth = right;
		this.on = on;
	}
	
	toEquation(){
		let left = this.left;
		let right = this.right;
		let L, R;
		if(typeof left === 'string'){
			L = left;
		}
		else if(left instanceof As){
			L = left.alias;
			left = left.toEquation();
		}
		if(typeof right === 'string'){
			R = right;
		}
		else if(right instanceof As){
			R = right.alias;
			right = right.toEquation();
		}
		
		let on = on.toEquation();
		
		
	}
}

class InnerJoin{
	constructor(left, right, on){
		this.left = left;
		this.rigth = right;
		this.on = on;
	}
	
}