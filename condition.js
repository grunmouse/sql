
class OR extends Set {
	spec(...arg){
		return new OR([...this].map(a=>(a.spec ? a.spec(...arg) : a)));
	}
	toEquation(){
		return [...this].map((a)=>(a.toEquation())).join(' OR ');
	}
}


class AND extends Set {
	spec(...arg){
		return new AND([...this].map(a=>(a.spec ? a.spec(...arg) : a)));
	}
	toEquation(){
		return [...this].map((a)=>{
			let code = a.toEquation();
			if(a instanceof OR){
				return '('+code+')';
			}
			else{
				return code;
			}
		}).join(' AND ');
	}
}

class NOT{
	constructor(frag){
		if(typeof frag === 'string'){
			frag = new Fragment(frag);
		}
		this.frag = frag;
	}
	spec(...arg){
		let a = this.frag;
		let frag = a.spec ? a.spec(...arg) : a;
		
		return new NOT(frag);
	}
	toEquation(){
		if(frag.not){
			return frag.not();
		}
		else if(frag instanceof AND || frag instanceof OR){
			return 'NOT (' + frag.toEquation() + ')';
		}
		else{
			return 'NOT ' + frag.toEquation();
		}
	}
}

class Fragment{
	constructor(code, wrap){
		this.code = wrap ? '(' + code + ')' : code;
	}
	spec(){
		return this;
	}
	toEquation(){
		return code;
	}
}

class Field extends Fragment{
	constructor(name){
		super(name);
	}
	spec(source){
		if(!!~this.code.indexOf('.')){
			return new Field(source + '.' + this.code);
		}
		else{
			return this;
		}
	}
}

class Literal extends Fragment{
	constructor(value){
		switch(typeof value){
			case 'number':
			case 'bigint':
				super(value.toString(10));
				break;
			case 'string':
				super('"' + value.split('"').join('""') + '"');
				break;
			case 'boolean':
				super(JSON.stringify(value));
				break;
		}
	}
}

class Equation{
	costructor(left, right){
		if(typeof left === 'boolean'){
			if(left){
				return new Field(right)
			}
			else{
				return new NOT(new Field(right));
			}
		}
		else if(typeof right === 'boolean'){
			if(right){
				return new Field(left)
			}
			else{
				return new NOT(new Field(left));
			}
		}
		
	}
	toEquation(){
		
	}
}

function toLiteral(value){
	switch(typeof value){
		case 'number':
		case 'bigint':
			return value.toString(10);
		case 'string':
			return '"' + value.split('"').join('""') + '"'
		case 'boolean':
			return JSON.stringify(value);
	}
}

class IsNull{
	constructor(key){
		this.key = key;
	}
	toEquation(){
		return `${this.key} IS NULL`;
	}
	not(){
		return `${this.key} IS NOT NULL`;
	}
}

function FieldCondition(key, value){
	switch(typeof value){
		case 'number':
		case 'bigint':
		case 'string':
			return new Fragment(key + ' = ' + toLiteral(value));
		case 'boolean':
			if(value){
				return new Fragment(key);
			}
			else{
				return new Fragment('NOT ' + key);
			}
		case 'object':
			if(object == null){
				return new IsNull(key);
			}
			else{
				if(value.spec){
					value = value.spec(key);
				}
				if(!value.toEquation){
					throw new Error('Invalid object');
				}
				return value;
			}
		case 'array':
			return new OR(
				value.map((val)=>(wrapEquation(key, val)))
			);
	}
}

