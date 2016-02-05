package simulation;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.EventQueue;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.Timer;
import javax.swing.WindowConstants;

public class DroneSimulation extends JFrame {
	
	private static final long serialVersionUID = 239930690335961755L;
	
	
	final String[] exitOptions = new String[]{"Save and exit", "Exit without save", "Cancel"};
	
	private JLabel jLSampleText;
	private JButton jBtnExit;
	private JButton jBtnReload;
	private SimulationPanel jSimuPanel;
	private JTextField jTFSpeed;
	private JTextField jTFRotation;
	private JTextField jTFPosX;
	private JTextField jTFPosY;
	private JTextField jTFZoom;
	private JButton jBtnUpdate;
	private JCheckBox jCheckWalls;


	private JCheckBox jCheckSight;


	private JCheckBox jCheckPoints;


	private JCheckBox jCheckFocus;

	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					DroneSimulation frame = new DroneSimulation();
					frame.setLocationRelativeTo(null);
					frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	public DroneSimulation() {
		super();
		initGUI();
		initAnimation();
	}
	public void initGUI() {
		try {
			javax.swing.UIManager.setLookAndFeel("com.sun.java.swing.plaf.windows.WindowsLookAndFeel");
			getContentPane().setLayout(null);
			setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
			setTitle("Drone Simulation - Jonathan Sigrist");
			pack();
			setSize(1100, 800);
			setMinimumSize(new Dimension(700, 500));
			
			{
				jLSampleText = new JLabel();
				getContentPane().add(jLSampleText);
				jLSampleText.setText("SAMPLE TEXT");
				jLSampleText.setBounds(50,50,250,16);
			}
			{
				jBtnExit = new JButton();
				getContentPane().add(jBtnExit);
				jBtnExit.setText("Exit");
				jBtnExit.setBounds(950, 700, 100, 25);
				jBtnExit.addActionListener(new ActionListener() {
					
					@Override
					public void actionPerformed(ActionEvent e) {
						jBtnExitActionPerformed(e);
						
					}
				});
			}
			{
				jBtnReload = new JButton();
				getContentPane().add(jBtnReload);
				jBtnReload.setText("Reload");
				jBtnReload.setBounds(15, 15, 100, 25);
				jBtnReload.addActionListener(new ActionListener() {
					
					@Override
					public void actionPerformed(ActionEvent e) {
						jBtnReloadActionPerformed(e);
						
					}
				});
			}
			{
				jBtnUpdate = new JButton();
				getContentPane().add(jBtnUpdate);
				jBtnUpdate.setText("Update");
				jBtnUpdate.setBounds(15, 300, 100, 25);
				jBtnUpdate.addActionListener(new ActionListener() {
					
					@Override
					public void actionPerformed(ActionEvent e) {
						jBtnUpdateActionPerformed(e);
						
					}
				});
				jBtnUpdate.addKeyListener(new KeyAdapter() {
					
					@Override
					public void keyPressed(KeyEvent e) {
						jBtnUpdateKeyPressed(e);					
					}
				});
			}
			{
				jCheckWalls = new JCheckBox();
				getContentPane().add(jCheckWalls);
				jCheckWalls.setBounds(15, 250, 15, 15);
				jCheckWalls.addActionListener(new ActionListener() {
					
					@Override
					public void actionPerformed(ActionEvent e) {
						jCheckWallsActionPerformed(e);
						
					}
				});
			}
			{
				jCheckSight = new JCheckBox();
				getContentPane().add(jCheckSight);
				jCheckSight.setBounds(50, 250, 15, 15);
				jCheckSight.addActionListener(new ActionListener() {
					
					@Override
					public void actionPerformed(ActionEvent e) {
						jCheckSightActionPerformed(e);
						
					}
				});
			}
			{
				jCheckPoints = new JCheckBox();
				getContentPane().add(jCheckPoints);
				jCheckPoints.setBounds(85, 250, 15, 15);
				jCheckPoints.addActionListener(new ActionListener() {
					
					@Override
					public void actionPerformed(ActionEvent e) {
						jCheckPointsActionPerformed(e);
						
					}
				});
			}
			{
				jCheckFocus = new JCheckBox();
				getContentPane().add(jCheckFocus);
				jCheckFocus.setBounds(110, 250, 15, 15);
				jCheckFocus.addActionListener(new ActionListener() {
					
					@Override
					public void actionPerformed(ActionEvent e) {
						jCheckFocusActionPerformed(e);
						
					}
				});
			}
			{
				jTFSpeed = new JTextField();
				getContentPane().add(jTFSpeed);
				jTFSpeed.setBounds(15, 50, 100, 25);
				jTFSpeed.setText("0");
				jTFSpeed.addKeyListener(new KeyAdapter() {
					
					@Override
					public void keyPressed(KeyEvent e) {
						jTFSpeedKeyPressed(e);					
					}
				});
			}
			{
				jTFRotation = new JTextField();
				getContentPane().add(jTFRotation);
				jTFRotation.setBounds(15, 85, 100, 25);
				jTFRotation.setText("0");
				jTFRotation.addKeyListener(new KeyAdapter() {
					
					@Override
					public void keyPressed(KeyEvent e) {
						jTFRotationKeyPressed(e);					
					}
				});
			}
			{
				jTFPosX = new JTextField();
				getContentPane().add(jTFPosX);
				jTFPosX.setBounds(15, 120, 100, 25);
				jTFPosX.setText("0");
				jTFPosX.addKeyListener(new KeyAdapter() {
					
					@Override
					public void keyPressed(KeyEvent e) {
						jTFPosXKeyPressed(e);					
					}
				});
			}
			{
				jTFPosY = new JTextField();
				getContentPane().add(jTFPosY);
				jTFPosY.setBounds(15, 155, 100, 25);
				jTFPosY.setText("0");
				jTFPosY.addKeyListener(new KeyAdapter() {
					
					@Override
					public void keyPressed(KeyEvent e) {
						jTFPosYKeyPressed(e);					
					}
				});
			}
			{
				jTFZoom = new JTextField();
				getContentPane().add(jTFZoom);
				jTFZoom.setBounds(15, 190, 100, 25);
				jTFZoom.setText("50");
				jTFZoom.addKeyListener(new KeyAdapter() {
					
					@Override
					public void keyPressed(KeyEvent e) {
						jTFZoomKeyPressed(e);					
					}
				});
			}
			{
				jSimuPanel = new SimulationPanel(Simuworld.MODE_BOX);
				getContentPane().add(jSimuPanel);
				jSimuPanel.setBounds(0, 0, 400, 400);
				jSimuPanel.setBorder(BorderFactory.createLineBorder(Color.BLACK));
//				jSimuPanel.repaint();
			}
			
			reorganizeComponents();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	private void initAnimation() {
		Timer animation = new Timer(1, new ActionListener() {
			
			boolean state = true;
			
			@Override
			public void actionPerformed(ActionEvent e) {
				if(state) {
					if(jSimuPanel.simu.timeUpdate(false)) {
						state = false;
					}
				}
				
			}
		});
		animation.start();
		

		Timer simulation = new Timer(1, new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent e) {
				updateValue();
				jSimuPanel.repaint();
				
			}
		});
		simulation.start();
		
		
		Timer meassuring = new Timer(1000, new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent e) {
				jSimuPanel.takeMeassure();
				
			}
		});
		meassuring.start();
	}
	
	private void checkKeys(KeyEvent e) {
		switch(e.getKeyCode()) {
		case KeyEvent.VK_W :
			speed += 0.1;
			break;
		case KeyEvent.VK_S :
			speed -= 0.1;
			break;
		case KeyEvent.VK_A :
			rotation += 0.02;
			break;
		case KeyEvent.VK_D :
			rotation -= 0.02;
			break;
		case KeyEvent.VK_Q :
			speed = 0;
			rotation = 0;
			break;
		default:
			System.out.println("Wrong key pressed: " + e.getKeyChar() + "(" + e.getKeyCode() + ")");
		}
	}
	
	private void reorganizeComponents() {
		int width = this.getWidth() - 18, height = this.getHeight() - 47;
		int varityLine = width -150 -width/8, varityDiff = width - varityLine;	
		
		System.out.println("Width: " + width + " Heigth: " + height);
		
		jLSampleText.setBounds(varityLine + 15, 15, varityDiff - 30, 25);
		jBtnReload.setBounds(varityLine + 15, 40, 120, 25);
		jBtnExit.setBounds(width - 150, height-40, 120, 25);
		jSimuPanel.setBounds(0, 0, varityLine, height);
		
		
		jTFSpeed.setBounds(varityLine + 15, 100, varityDiff/2 - 30, 25);
		jTFRotation.setBounds(varityLine + 15 + varityDiff/2, 100, varityDiff/2 - 30, 25);
		jTFPosX.setBounds(varityLine + 15, 140 , varityDiff/2 - 30, 25);
		jTFPosY.setBounds(varityLine + 15 + varityDiff/2, 140, varityDiff/2 - 30, 25);
		jTFZoom.setBounds(varityLine + 15, 180, varityDiff/2 - 30, 25);
		jBtnUpdate.setBounds(varityLine + 15, 225, varityDiff - 30, 25);
		jCheckWalls.setBounds(varityLine + 25, 265, 20, 20);
		jCheckSight.setBounds(varityLine + 60, 265, 20, 20);
		jCheckPoints.setBounds(varityLine + 95, 265, 20, 20);
		jCheckFocus.setBounds(varityLine + 130, 265, 20, 20);
	}
	private void openSaveDialog() {//TODO Save Dialog + save operation
		System.out.println("Saving... please wait...");
	}
	
	float posX, posY, speed, rotation;
	double zoom = 50; 
	
	private void updateValue() {
		try {
			if(rotation <= 1e-8 && rotation >= -1e-8 && rotation != 0) {
				rotation = 0;
				System.out.println("Fehler behoben! Im frame");
				rotation = 0;
			}
			jSimuPanel.getDrone().setSpeed(speed);
			jSimuPanel.getDrone().setRotation(rotation);
			jSimuPanel.setZoom(zoom);
			jSimuPanel.setLocation(posX, posY);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	private void parseValue() {
		try {
		speed = Float.parseFloat(jTFSpeed.getText());
		rotation = Float.parseFloat(jTFRotation.getText());
		zoom = Double.parseDouble(jTFZoom.getText());
		posX = Float.parseFloat(jTFPosX.getText());
		posY = Float.parseFloat(jTFPosY.getText());
		} catch(Exception e) {
			e.printStackTrace();
			System.out.println("Error while parsing values to Use");
		}
	}
	private void updateDroneMovement() {
		jSimuPanel.simu.timeUpdate(true);
	}
	
	private void jBtnExitActionPerformed(ActionEvent e) {
		int selection = JOptionPane.showOptionDialog(this, "Save before exit?", "Option Dialog Box",
				0, JOptionPane.QUESTION_MESSAGE, null, exitOptions, exitOptions[exitOptions.length-1]);
		switch(selection) {
		case 0 : 
			openSaveDialog();
			System.exit(0);
			break;
		case 1 :
			System.exit(0);
			break;
		case 2 :
			break;
		}
	}
	private void jBtnReloadActionPerformed(ActionEvent e) {
		reorganizeComponents();
		updateValue();
		jSimuPanel.repaint();
	}
	private void jBtnUpdateActionPerformed(ActionEvent e) {
		parseValue();
		updateDroneMovement();
	}
	private void jBtnUpdateKeyPressed(KeyEvent e) {
		checkKeys(e);
	}
	private void jCheckWallsActionPerformed(ActionEvent e) {
		boolean walls = jCheckWalls.isSelected();
		jSimuPanel.showWalls(walls);
	}
	private void jCheckSightActionPerformed(ActionEvent e) {
		boolean sight = jCheckSight.isSelected();
		jSimuPanel.showSightLines(sight);
	}
	private void jCheckPointsActionPerformed(ActionEvent e) {
		boolean points = jCheckPoints.isSelected();
		jSimuPanel.showOldPoints(points);
	}
	private void jCheckFocusActionPerformed(ActionEvent e) {
		jSimuPanel.focusDrone(jCheckFocus.isSelected());
	}
	private void jTFSpeedKeyPressed(KeyEvent e) {
		if(e.getKeyCode() == KeyEvent.VK_ENTER) {
			parseValue();
		}
	}
	private void jTFRotationKeyPressed(KeyEvent e) {
		if(e.getKeyCode() == KeyEvent.VK_ENTER) {
			parseValue();
		}
	}
	private void jTFPosXKeyPressed(KeyEvent e) {
		if(e.getKeyCode() == KeyEvent.VK_ENTER) {
			parseValue();
		}
	}
	private void jTFPosYKeyPressed(KeyEvent e) {
		if(e.getKeyCode() == KeyEvent.VK_ENTER) {
			parseValue();
		}
	}
	private void jTFZoomKeyPressed(KeyEvent e) {
		if(e.getKeyCode() == KeyEvent.VK_ENTER) {
			parseValue();
		}
	}


}
