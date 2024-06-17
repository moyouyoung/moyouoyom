angleStep = 5; //degrees
length = 30; // pixels
// Find the ROI
Roi.getBounds(x, y, width, height);

// The x and y coordinates are from the top left , 
// so we need to add half the width and half the height to get the center
xc = x + width/2;
yc = y + height/2;
// test
length = round(width *1.414);


print( "Center found at ("+xc+","+yc+")" );
print("Length ("+length+")" );

// Prepare the ROI Manager to receive the lines
roiManager("reset");

// Add the circle, remove igf not needed
roiManager("add");

// Make the concentric lines
for(i=0; i<360; i+=angleStep) {
	x2 = xc + length * cos( i/360 * 2* PI);
	y2 = yc - length * sin( i/360 * 2* PI);
	//print( "Draw line at ("+x2+","+y2+")" );
	makeLine(xc, yc, x2, y2);
	roiManager("add");
}

// Display the lines for the user
roiManager("Show All with labels");
