CREATE TABLE IF NOT EXISTS settings(                                                                                                  
  maintenance BOOLEAN,                                                                                                 
  maintenanceText TEXT,                                                                                                
  canvasWidth INT,                                                                                                    
  canvasHeight INT,                                                                                                   
  pixelSize INT                                                                                                    
); 

INSERT INTO settings(maintenance, canvasWidth, canvasHeight, pixelSize) 
SELECT * FROM (
 SELECT FALSE, 3000, 2000, 10
) AS tmp
WHERE NOT EXISTS (
 SELECT maintenance FROM settings
);

CREATE TABLE IF NOT EXISTS grid(
  x INT,
  y INT,
  color VARCHAR(6) CHECK (color ~* '^[a-f0-9]{6}$')
);
