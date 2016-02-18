package simulation;

import java.util.ArrayList;

public class Simuworld {

	static final int MODE_CUSTOM = 0;
	static final int MODE_BOX = 1;
	static final int MODE_REALISTIC = 2;
	static final int MODE_CRAZY = 3;
	
	ArrayList<Float[]> walls;
	Drone drone;
	long time;
	
//	public static void main(String[] args) {
//		Simuworld sim = new Simuworld(Simuworld.MODE_BOX);
//	}
	
	public Simuworld () {
		this(MODE_CUSTOM);
	}
	
	public Simuworld(int mode) {
		walls = new ArrayList<Float[]>();
		switch(mode) {
		case 0 : 
			System.out.println("Custom Mode selected!");
			break;
		case 1 :
			System.out.println("Box Mode selected...");
			walls.add(new Float[]{-5f,-5f,  0f, 10f});
			walls.add(new Float[]{-5f, 5f, 10f,  0f});
			walls.add(new Float[]{ 5f, 5f,  0f,-10f});
			walls.add(new Float[]{ 5f,-5f,-10f,  0f});
			break;
		case 2 :
			System.out.println("Realistic Mode selected");
			break;
		case 3 :
			break;
		default :
			System.out.println("No pregenerated Mode selected. Changing to Custom-Mode!");
			break;
		}
		drone = new Drone();
		sightLines = 5;
		FoV = 0.1f;
		sightLength = 4f;
		time = System.currentTimeMillis();
		System.out.println("Drone started... ready to go!");
	}
	public float[][] getWalls() {
		float[][] wallList = new float[walls.size()][4];
		
		for(int i = 0; i < walls.size(); i++) {
			for(int j = 0; j < 4; j++) {
				wallList[i][j] = walls.get(i)[j];
			}
		}
		
		return wallList;
	}
	

	int sightLines;
	float sightLength;
	float FoV;
	
	public float[][] getSightLines() {

		float[][] sight = new float[sightLines][4];
		
		float[] data = drone.getData();
		float x = data[0];
		float y = data[1];
		float grd = data[2];
		
		for(int i = 0; i < sightLines; i++) {
			float vX = (float) (x - Math.sin(2 * Math.PI * grd + 2 * i * FoV/(sightLines-1) - FoV) * sightLength);
			float vY = (float) (y + Math.cos(2 * Math.PI * grd + 2 * i * FoV/(sightLines-1) - FoV) * sightLength);
			
			sight[i] = new float[]{x,y,vX,vY};
		}
		
		return sight;
	}
	public float[][] getSightPoints() {
		float[][] points = new float[sightLines + 1][2];
		
		float[][] sight = getSightLines();
		
		float shorty = -1;
		
		for(int i = 0; i < sightLines; i++) {
			
			float shortest = -1;
			
			float xm = sight[i][2] - sight[i][0];
			float ym = sight[i][3] - sight[i][1];
			
			for(int j = 0; j < walls.size(); j++) {
				
				float xn = -walls.get(j)[2];
				float yn = -walls.get(j)[3];

				float xv = walls.get(j)[0] - sight[i][0];
				float yv = walls.get(j)[1] - sight[i][1];
				
				float m = 0, n = 0;
				
				if(xv == 0 && yv == 0 /* ALLE UNSINNIG, WEIL LÄNGE UNTERSCHIEDLICH PUNKT AUCH AUF GERADEN || ((xm == xn || xm == - xn) && (ym == yn || ym == - yn))*/) {
					m = -1; n = -1;
				} else if(yn == 0) {
					
					m = yv/ym;
					n = (xv - xm * m) / xn;
					
				} else if(xn == 0) {
					m = xv / xm;
					n = (yv - ym * m) / yn;
				} else {
				
					m = (xv - (yv * xn / yn)) / (xm - (ym * xn / yn));
					n = (xv - m) / yv;
				}
				
//				System.out.println("Line " + i + " with wall "+ j + ": m = " + m + ", n = " + n);
				
				if(m >= 0 && m <= 1 && n >= 0 && n <= 1) {
					if(shortest == -1 || m < shortest) { 
						shortest = m;
					}
				}
			}
			
			if(shorty == -1 || (shortest < shorty && shortest != -1)) {
				shorty = shortest;
			}
			
			if(shortest == -1) {
				points[i] = null;
			} else {
				points[i][0] = sight[i][0] + shortest * xm;
				points[i][1] = sight[i][1] + shortest * ym;
			}
		}
		
		if(shorty == -1) {
			points[points.length - 1] = null;
		} else {
			points[points.length - 1][0] = (float) (drone.posX - Math.sin(drone.grd * 2 * Math.PI) * sightLength * shorty);
			points[points.length - 1][1] = (float) (drone.posY + Math.cos(drone.grd * 2 * Math.PI) * sightLength * shorty);
		}
		
		return points;
	}
	public float[] getDroneSight() {
		float[] sightPoint = new float[2];

		sightPoint[0] = (float) (drone.posX - Math.sin(drone.grd * 2 * Math.PI) * sightLength);
		sightPoint[1] = (float) (drone.posY + Math.cos(drone.grd * 2 * Math.PI) * sightLength);
		
		return sightPoint;
	}
	
	public boolean timeUpdate(boolean debug) {
		long actualTime = System.currentTimeMillis();
		long timedelta = actualTime - time;
		if(debug) System.out.println("Time: " + timedelta);
		time = actualTime;
		
		drone.move(timedelta/1000f);
		return false;
	}
	
}
