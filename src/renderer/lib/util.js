import Q from 'q';

export function uuid(length = 6) {
	let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	let radix = chars.length;
	let result = [];

  for (let i = 0; i < length; i++) {
    result[i] = chars[0 | Math.random() * radix];
  }

	return result.join('');
}

export function stamp() {
	return parseInt(Date.now() / 1000);
}

export function rejectError(err, deferred) {
	err && console.error(err);
	deferred.reject(err || undefined);
}

export function loadScript(src) {
	let deferred = Q.defer();

	let head = document.getElementsByTagName('head')[0];
	let script = document.createElement("script");
	script.type= 'text/javascript';
	script.onload = () => deferred.resolve();
	script.onerror = err => {console.log(err); deferred.resolve();};
	script.src = src;
	head.appendChild(script);

	return deferred.promise;
}
