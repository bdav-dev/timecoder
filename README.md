# timecoder
Timecode calculator

```Project language: English```

## Short description
With "Timecoder" you can document in/out sequences of a video. When specifying an in and out timecode, "Timecoder" will calculate the difference between the two. You are also able to add a comment to a in/out sequence.

You can export and share your sequences via a .csv table or a link.

If you are a video producer, your client can document desired corrections with this web application and send you back a link so you can implement these corrections.

This application uses Next.js with React and TypeScript.

## Use Timecoder
### Website
You can use Timecoder in the web with this website: [https://timecoder.vercel.app/]

### From source code
You can download the source code of the application and run the app locally. To achieve this, follow these steps:
1. Make sure you have Node.js installed.
2. Download the source code of the project (as a .zip file or via ``git clone``).
3. Open a terminal in the project's root directory.
4. Run ``npm install`` to install the project's dependencies.
5. Start the developement server by entering the command ``npm run dev``.
6. Open your browser and enter [http://localhost:3000/] in the address bar.

## Features
### <ins>Project settings</ins>
You can set a project name and a framerate (currently 24, 25, 30, 50 and 60 fps are supported).

### <ins>In/Out sequences</ins>
A in/out sequence consists of an in and out timecode, a difference timecode and a comment field.
The in-timecode specifies the beginning of the sequence via a timecode (example: ``00``:``01``:``15``:``14``).
The out-timecode specifies the end the sequence also via a timecode (example: ``00``:``02``:``01``:``21``).
Timecoder automatically calculates the difference between the in and the out timecode and displays the result in the difference timecode (example: ``00``:``00``:``46``:``07``).
You are able to comment the sequence, for example to state some corrections in that timeframe (example: ``Please add a caption here with text: "Our company is proud to announce the opening of its second factory in Berlin."``).
You can also delete sequences and change the arrangement by swapping them.

### <ins>Total</ins>
Timecoder calculates the sum of the differences and displays it at the bottom left corner.

### <ins>Share and export</ins>
You can share and export the complete state of the application via 2 ways:
1. **Via .csv table**:<br/>
The .csv table export option is perfect if you want to save your work locally or want to print it out.
2. **Via link**:<br/>
If you want to share your work with another person or want to save your work for later editing, this option is for you. The link contains a long string in which the whole state of the application is contained.

### <ins>Local storage</ins>
The entire state of the application is saved in your local storage. This means, if you close your browser and reopen it, all of your work is still there.

## Limitations
- The app is not optimized for mobile use.


## Changelog
### Version 1.1