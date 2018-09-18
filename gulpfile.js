// this file will attempt to:
//     1-execute command to start a process that will:
//         1.1-listen to a file and when it is saved called "commitMessageAndPushOnChange.txt"
//         1.2-run a webpack command to properly compile the app to
//         1.3-make a commit message with the first line in the commitMessageAndPushOnChange.txt file
//         1.4-execute a git command to push to github
//         1.5-push to surge



var gulp = require('gulp'),
    gutil = require('gulp-util');




const { exec } = require('child_process');
fs = require('fs');


var customWebpackFileName = 'my.custom.webpack.config';
var webpackConfigPath = '../web';
var bundleFilePath = 'dist/bundle.js';
var indexFilePath = 'index.html';

function onFileChange() {
    fs.readFile('./commitMessageCompileAndPushOnChange.txt', 'utf8', function (err, commitMessage) {
        if (err) {
            return console.log(err);
        }

        console.log('one?');

        exec(`cd ${webpackConfigPath} && npm run webpack`, (err, stdout, stderr) => {                           //once the build is done, copy over the distributable files then its time to run the surge command to push the project live
            console.log('two...', stdout);

            exec(`mkdir ./surgeDeployment`, (err, stdout, stderr) => {                                          //make sure to make the directory so I dont get an error on the next line
                exec(`copy ${bundleFilePath} ./surgeDeployment/${bundleFilePath}`, (err, stdout, stderr) => {   //once the build is done its time to run the surge command to copy the bundle.js file over that was just built
                    exec(`copy ${indexFilePath} ./surgeDeployment/${indexFilePath}`, (err, stdout, stderr) => { //once the build is done its time to run the surge command to copy the index.html file over that could of possibly been changed
                        exec(`git add -A && git commit -m "auto gulp build" && git push origin master`, (err, stdout, stderr) => {
                            exec(`cd ./surgeDeployment && surge`, (err, stdout, stderr) => {
                         
                                console.log('testing');

                            });
                        })


                    });


                });
            });
            
        });
    });
}






gulp.task('default', function () {
    onFileChange();
    // return gutil.log('Gulp is running!')
});


gulp.watch('commitMessageCompileAndPushOnChange.txt', ['default']);

