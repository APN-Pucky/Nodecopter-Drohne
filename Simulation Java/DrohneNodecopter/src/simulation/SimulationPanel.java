package simulation;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.util.ArrayList;

import javax.swing.JPanel;

public class SimulationPanel extends JPanel {
	
	Simuworld simu;
	double zoom;
	float dX, dY;
	boolean drawWalls, drawSight, drawPoints, meassure, focusDrone;
	ArrayList<Float[]> points, wrongPoints;
	
	public SimulationPanel(int mode) {
		super();
		simu = new Simuworld(mode);
		zoom = 50;
		dX = 0;
		dY = 0;
		drawWalls = false;
		drawSight = false;
		drawPoints = false;
		focusDrone = false;
		points = new ArrayList<Float[]>();
		wrongPoints = new ArrayList<Float[]>();
	}
	
	public void paintComponent(Graphics g0) {
		super.paintComponent(g0);
		
		if(focusDrone) {
			dX = simu.drone.posX;
			dY = simu.drone.posY;
		}
		
		Graphics2D g = (Graphics2D) g0;
		
		if(drawWalls) {//walls
			g.setColor(Color.LIGHT_GRAY);
			float[][] walls = simu.getWalls();
			
			for(int i = 0; i < walls.length; i++) {
				g.drawLine((int)((-dX + walls[i][0]) * zoom + (this.getWidth()/2)),
						(int)((dY - walls[i][1]) * zoom + (this.getHeight()/2)),
						(int)((-dX + walls[i][0] + walls[i][2]) * zoom + (this.getWidth()/2)),
						(int)((dY - walls[i][1] - walls[i][3]) * zoom + (this.getHeight()/2)));
			}
		}
		
		{//drone sight lines
			float[][] sight = simu.getSightLines();
			float[][] sightPoints = simu.getSightPoints();
			
			if(drawSight) {
				for(int i = 0; i < sight.length; i++) {
					if(sightPoints[i] == null) {
						g.setColor(Color.RED);
						g.drawLine((int)((-dX + sight[i][0]) * zoom + (this.getWidth()/2)),
								(int)((dY - sight[i][1]) * zoom + (this.getHeight()/2)),
								(int)((-dX + sight[i][2]) * zoom + (this.getWidth()/2)),
								(int)((dY - sight[i][3]) * zoom + (this.getHeight()/2)));
					} else {
						g.setColor(Color.BLUE);
						g.drawLine((int)((-dX + sight[i][0]) * zoom + (this.getWidth()/2)),
								(int)((dY - sight[i][1]) * zoom + (this.getHeight()/2)),
								(int)((-dX + sightPoints[i][0]) * zoom + (this.getWidth()/2)),
								(int)((dY - sightPoints[i][1]) * zoom + (this.getHeight()/2)));
						g.drawOval((int)((-dX + sightPoints[i][0]-0.1) * zoom + (this.getWidth()/2)),
								(int)((dY - sightPoints[i][1]-0.1) * zoom + (this.getHeight()/2)),
								(int)((0.2)*zoom),
								(int)((0.2)*zoom));
					}
				}
			}
			if(sightPoints[sightPoints.length - 1] == null) {
				g.setColor(Color.RED);
				g.drawString("Incorrect Data", 10,20);
			} else {
				g.setColor(Color.BLACK);
				g.drawOval((int)((-dX + sightPoints[sightPoints.length - 1][0]-0.1) * zoom + (this.getWidth()/2)),
						(int)((dY - sightPoints[sightPoints.length - 1][1]-0.1) * zoom + (this.getHeight()/2)),
						(int)((0.2)*zoom),
						(int)((0.2)*zoom));
			}
			if(meassure) {
				if(sightPoints[sightPoints.length - 1] == null) {
					float[] droneSightPoint = simu.getDroneSight();
					System.out.println("Wrong point detected at " + droneSightPoint[0] + ", " + droneSightPoint[1] + "!");
					wrongPoints.add(new Float[]{droneSightPoint[0], droneSightPoint[1]});
				} else {
					points.add(new Float[]{sightPoints[sightPoints.length - 1][0],sightPoints[sightPoints.length - 1][1]});
				}
				meassure = false;
			}
		}
		{//old Points
			if(drawPoints) {
				g.setColor(Color.GRAY);
				for(int i = 0; i < points.size(); i++) {
					g.drawOval((int)((-dX + points.get(i)[0]-0.1) * zoom + (this.getWidth()/2)),
							(int)((dY - points.get(i)[1]-0.1) * zoom + (this.getHeight()/2)),
							(int)((0.2)*zoom),
							(int)((0.2)*zoom));
				}
				g.setColor(Color.ORANGE);
				for(int i = 0; i < wrongPoints.size(); i++) {
					g.drawOval((int)((-dX + wrongPoints.get(i)[0]-0.1) * zoom + (this.getWidth()/2)),
							(int)((dY - wrongPoints.get(i)[1]-0.1) * zoom + (this.getHeight()/2)),
							(int)((0.2)*zoom),
							(int)((0.2)*zoom));
				}
			}
		}
		{//drone symbol
			g.setColor(Color.YELLOW);
			g.setStroke(new BasicStroke((float) ((1 + Math.abs(simu.drone.spd) ) * zoom/25)));
			
			double PosX = simu.drone.getData()[0];
			double PosY = simu.drone.getData()[1];
			
			double deltaX = -Math.sin((simu.drone.grd + 0.125) * 2 * Math.PI) * zoom/50 ;
			double deltaY = -Math.cos((simu.drone.grd + 0.125) * 2 * Math.PI) * zoom/50 ;

			g.drawLine((int)((PosX - deltaX - dX) * zoom + (this.getWidth()/2)),
					(int)(-(PosY + deltaY - dY) * zoom + (this.getHeight()/2)),
					(int)((PosX + deltaX - dX) * zoom + (this.getWidth()/2)),
					(int)(-(PosY - deltaY - dY) * zoom + (this.getHeight()/2)));
			g.drawLine((int)((PosX + deltaY - dX) * zoom + (this.getWidth()/2)),
					(int)(-(PosY + deltaX - dY) * zoom + (this.getHeight()/2)),
					(int)((PosX - deltaY - dX) * zoom + (this.getWidth()/2)),
					(int)(-(PosY - deltaX - dY) * zoom + (this.getHeight()/2)));
			g.setColor(Color.RED);
			g.fillOval((int)((PosX - deltaX - dX - 0.1) * zoom + (this.getWidth()/2)),
					(int)(-(PosY + deltaY - dY + 0.1) * zoom + (this.getHeight()/2)),
					(int)(0.2 * zoom), (int)(0.2 * zoom));
			g.fillOval((int)((PosX + deltaY - dX - 0.1) * zoom + (this.getWidth()/2)),
					(int)(-(PosY + deltaX - dY + 0.1) * zoom + (this.getHeight()/2)),
					(int)(0.2 * zoom), (int)(0.2 * zoom));
			g.setColor(Color.GREEN);
			g.fillOval((int)((PosX - deltaY - dX - 0.1) * zoom + (this.getWidth()/2)),
					(int)(-(PosY - deltaX - dY + 0.1) * zoom + (this.getHeight()/2)),
					(int)(0.2 * zoom), (int)(0.2 * zoom));
			g.fillOval((int)((PosX + deltaX - dX - 0.1) * zoom + (this.getWidth()/2)),
					(int)(-(PosY - deltaY - dY + 0.1) * zoom + (this.getHeight()/2)),
					(int)(0.2 * zoom), (int)(0.2 * zoom));
		}
		
	}
	public void setZoom(double pZoom) {
		zoom = pZoom;
	}
	public void setLocation(float pDX, float pDY) {
		dX = pDX;
		dY = pDY;
	}
	public Drone getDrone() {
		return simu.drone;
	}
	public void showWalls(boolean drawWalls) {
		this.drawWalls = drawWalls;
	}
	public void showSightLines(boolean drawLines) {
		this.drawSight = drawLines;
	}
	public void showOldPoints(boolean showPoints) {
		this.drawPoints = showPoints;
	}
	public void takeMeassure() {
		meassure = true;
	}
	public void focusDrone(boolean focus) {
		focusDrone = focus;
	}

}
