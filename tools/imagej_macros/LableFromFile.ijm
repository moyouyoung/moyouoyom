// ImageJ/Fiji macro to label slices in a stack with values read from a text file
// Author: Ved P Sharma (June 2, 2021)

str = File.openAsString("");
labels=split(str,"\n")
n = labels.length;
for(i=0; i<n; i++) {
	label = labels[i];
	sliceNumber=toString(i+1)+"-"+toString(i+1);
	run("Label...", "format=Text starting=0 interval=1 x=5 y=20 font=18 text=&label range=&sliceNumber");
	}