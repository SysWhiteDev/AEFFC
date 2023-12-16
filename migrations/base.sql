CREATE TABLE settings(                                                                                                         
   maintenance BOOLEAN,                                                                                                        
   maintenanceText TEXT,                                                                                                       
   canvasWidth INT,                                                                                                           
   canvasHeight INT,                                                                                                          
   pixelSize INT                                                                                                           
);  
INSERT INTO settings(maintenance, canvasWidth, canvasHeight, pixelSize) VALUES (FALSE, 3000, 2000, 10);
CREATE TABLE grid(
   x INT,
   y INT,
   color VARCHAR(6) CHECK (color ~* '^[a-f0-9]{6}$')
);
