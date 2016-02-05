package simulation;

public class Drone {
	
	static final float PI = (float) Math.PI;
	
	float posX, posY, grd;
	float spd, rot;
	
	
	public Drone() {
		posX = posY = grd = spd = rot = 0;
	}
	
	public void setRotation(float pRot) {
		rot = pRot;
	}
	public void setSpeed(float pSpd) {
		spd = pSpd;
	}
	public float[] getData() {
		return new float[]{posX, posY, grd, spd, rot};
	}
	
	public void move(float time) {
//		System.out.println("Rotation: " + rot + ", Speed: " + spd);
		if(rot <= 1e-8 && rot >= -1e-8) {
			rot = 0;
			posX -= Math.sin(2 * PI * grd) * spd * time;
			posY += Math.cos(2 * PI * grd) * spd * time;
		} else {
			float totRot = time * rot;
		
			float radius = spd / (2 * PI * rot);
			
			posX += radius * (Math.cos(2 * PI * (totRot + grd)) - Math.cos(2 * PI * grd));
			posY += radius * (Math.sin(2 * PI * (totRot + grd)) - Math.sin(2 * PI * grd));
			grd += totRot;
		}
	}
	
}
