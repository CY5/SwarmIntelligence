class  Fish{
	constructor (position){
		this.acceleration = new vec3(0,0,0);
		this.velocity = new vec3(random(-1,1),random(-1,1),random(-1,1));
		this.position = position;
		this.pos = new vec3(position.x, position.y, position.z);
		this.r = 1;
		this.maxspeed = 0.3;
		this.maxforce = 0.1;
		this.fearless = random(15,30);
	}

	update() {
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxspeed);
		this.pos.add(this.velocity);
		this.position.x = this.pos.x; 
		this.position.y = this.pos.y; 
		this.position.z = this.pos.z; 
		this.acceleration.mul_t(0);
	}

	applyForce(force = vec3(0, 0,0)){
		this.acceleration.add(force);
	}

	applyBehaviors (fishes = [], mouse = new vec3(0,0,0)) {
		let separateForce  = this.separate(fishes);
		let seekForce = this.arrive(mouse);
		separateForce.mul_t(2);
		seekForce.mul_t(1);
		this.applyForce(separateForce);
		this.applyForce(seekForce);
	}

	flock (fishes = []) {
		let sep = this.separate(fishes);
		let ali = this.alignF(fishes);
		let coh = this.cohesion(fishes);

		sep.mul_t(1.5);
		ali.mul_t(1.0);
		coh.mul_t(1.0);

		this.applyForce(sep);
		this.applyForce(ali);
		this.applyForce(coh);
	}
	separate (fishes, food = false) {
		let steer = new vec3(0,0,0);
		let desiredseparation = this.r ;
		let count = 0;
		fishes.forEach((ele, idx) => {
			let d =  v3.dist(this.pos, ele.pos);
			if ((d > 0) && (d < desiredseparation)){
				let diff =  v3.sub(this.pos, ele.pos);
				diff.normalize();
				diff.div_t(d);
				steer.add(diff);
				count++;
			}
		});
		if (count > 0) {
			steer.div_t(count);
		}

		if (steer.length > 0){
			steer.setMag(this.maxspeed);
			steer.sub(this.velocity);
			steer.limit(this.maxforce);
		}
		if (food)
			this.applyForce(steer);
		return steer;
	}
	alignF (fishes = []) {
		let neighbordist =50;
		let sum = new vec3(0,0,0);
		let count = 0;
		fishes.forEach((ele, idx) => {
			let d = v3.dist(this.pos, ele.pos);
			if ((d > 0) && ( d < neighbordist)) {
				sum.add(ele.velocity);
				count++;
			}
			sum.add(ele.velocity);
		})
		if (count > 0) {
			sum.div_t(count);
			sum.setMag(this.maxspeed);
			let steer = v3.sub(sum, this.velocity);
			steer.limit(this.maxforce);
			return steer;
		} else {
			return new vec3(0,0,0);
		}
	}
	cohesion (fishes = []){
		let neighbordist = 50;
		let sum = new vec3(0,0,0);
		let count = 0;
		fishes.forEach((ele, idx) => {
			let d = v3.dist(this.pos, ele.pos);
			if ((d > 0) && ( d < neighbordist)) {
				sum.add(ele.pos);
				count++;
			}
		});
		if (count > 0) {
			sum.div_t(count);
			return this.seek(sum);
		} else {
			return new vec3(0,0,0);
		}
	}

	seek (target = new vec3(0,0,0), food = false){
		let desired = v3.sub(target, this.pos);
		desired.setMag(this.maxspeed);
		let steer = v3.sub(desired, this.velocity);
		steer.limit(this.maxforce);
		if (food)
			this.applyForce(steer);
		return steer;
	}



	flee (target = new vec3(0,0,0)){
		let dist = v3.dist(target, this.pos);

		if (dist < 15){
			let desired = v3.sub(target, this.pos).neg_xyz;
			let steer = v3.sub(desired, this.velocity);
			//steer.limit(this.maxforce);
			this.applyForce(steer);
		}
		//return steer;
	}

	arrive (target = new vec3(0,0,0)) {
		let desired = new  v3.sub(target, this.pos);
		let d = desired.length || 0.0;
		desired.normalize();
		if (d < 10) {
			let  m = v3.map(d, 0, 25, 0, this.maxspeed);
			desired.mul_t(m);
		} else {
			desired.mul_t(this.maxspeed);
		}
		let steer = v3.sub(desired, this.velocity);
		//steer.limit(this.maxforce*2);
		//this.applyForce(steer);
		return steer;
	}
	wandering (r) {
		let desired = null;
		//let predict = this.velocity.xyz;
		let predict = new vec3(Math.random()*100,Math.random(),Math.random());
		predict.mul_t(25);

	//	let circleposition = new vec3(0,0,0);
		let futureposition = v3.add(this.pos, predict);
		let distance = v3.dist(futureposition, this.circleposition);

		if ( distance > 1) {
			let toCenter = v3.sub(this.circleposition, this.pos);
			toCenter.setMag(this.velocity.length);
			desired = v3.add(this.velocity, toCenter);
			desired.setMag(this.maxspeed);
		}
		if (desired != null){
			let steer = v3.sub(desired, this.velocity);
			steer.limit(this.maxforce);
			this.applyForce(steer);
		}
		this.circleposition = futureposition.xyz;
	}
	boundaries (d) {
		let desired = null;
		let cp = new vec3(0,0,0);
		let distance = v3.dist(this.pos, cp);

		if ( distance > d) {
			let toCenter = v3.sub(cp, this.pos);
			toCenter.setMag(this.velocity.length);
			desired = v3.add(this.velocity, toCenter);
			desired.setMag(this.maxspeed);
		}

		if (desired != null) {
			let steer = v3.sub(desired, this.velocity);
			steer.limit(this.maxforce);
			this.applyForce(steer);
		}
	}

	getDirection () {
		let d = this.velocity.xyz;
		d.mul_t(this.maxspeed);
		//d.setMag(this.maxspeed);
		return d;
	}
}

