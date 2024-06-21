// Obtenido de http://imagej.1557.x6.nabble.com/How-to-save-all-opened-images-td3686986.html

// get image IDs of all open images
dir = getDirectory("Choose a Directory");
//ids=newArray(nImages);
for (i=0;i<nImages;i++) {
        selectImage(i+1);
        title = getTitle;
        print(title);
        run("Show Info...");
        //ids[i]=getImageID;

        saveAs("Text", dir+title+"_info");
} 
run("Close All");
