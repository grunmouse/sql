/*

select

insert

delete
*/


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

function wrapEquation(key, value){
	switch(typeof value){
		case 'number':
		case 'bigint':
		case 'string':
			return key + ' = ' toLiteral(value);
		case 'boolean':
			if(value){
				return key;
			}
			else{
				return 'NOT ' + key;
			}
		case 'object':
			if(object == null){
				return key + ' IS NULL';
			}
			else{
				return value.toEquation(key);
			}
		case 'array':
			return '(' + value.map((val)=>(wrapEquation(key, val))).join(' OR ') + ')';
	}
}

function makeWhere(obj){
	return Object.keys(obj).map((key)=>{
		let value = obj[key];
		return wrapEquation(key, value);
	}).join(' AND ');
}